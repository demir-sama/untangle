import type { ActionRunContext } from "@agent-native/core/action";
import { and, desc, eq, isNull } from "drizzle-orm";

import { stateSchema, type ProjectState } from "../../shared/untangle.js";
import { getDb } from "../db/index.js";
import { projects, revisions, exportsTable } from "../db/schema.js";
import { errors, requireIdentity, composeExport } from "./rules.js";

type Db = ReturnType<typeof getDb>;
function scoped(id: string, ctx: ActionRunContext) {
  return and(
    eq(projects.id, id),
    eq(projects.ownerEmail, requireIdentity(ctx)),
    ctx.orgId ? eq(projects.orgId, ctx.orgId) : isNull(projects.orgId),
  );
}
export function createStore(db: Db) {
  async function create(
    id: string,
    title: string,
    label: string,
    author: string,
    text: string,
    ctx: ActionRunContext,
  ) {
    const actor = requireIdentity(ctx),
      at = new Date().toISOString();
    return db.transaction(async (tx) => {
      const state: ProjectState = {
        sources: [
          { id: crypto.randomUUID(), kind: "baseline", label, author, text },
        ],
        findings: [],
      };
      await tx
        .insert(projects)
        .values({
          id,
          title,
          revision: 1,
          ownerEmail: actor,
          orgId: ctx.orgId ?? null,
          createdAt: at,
          updatedAt: at,
        });
      await tx
        .insert(revisions)
        .values({
          projectId: id,
          revision: 1,
          ownerEmail: actor,
          orgId: ctx.orgId ?? null,
          state,
          event: "project_created",
          actor,
          caller: ctx.caller,
          createdAt: at,
        });
      return { id, title, revision: 1, createdAt: at, updatedAt: at };
    });
  }
  async function list(ctx: ActionRunContext) {
    return db
      .select({
        id: projects.id,
        title: projects.title,
        revision: projects.revision,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
      })
      .from(projects)
      .where(
        and(
          eq(projects.ownerEmail, requireIdentity(ctx)),
          ctx.orgId ? eq(projects.orgId, ctx.orgId) : isNull(projects.orgId),
        ),
      )
      .orderBy(desc(projects.updatedAt))
      .limit(50);
  }
  async function get(id: string, ctx: ActionRunContext) {
    const [p] = await db
      .select()
      .from(projects)
      .where(scoped(id, ctx))
      .limit(1);
    if (!p)
      return errors.fail(
        "Project not found or not available to this account.",
        "not_found",
        { statusCode: 404 },
      );
    const [snapshot] = await db
      .select({ state: revisions.state })
      .from(revisions)
      .where(
        and(eq(revisions.projectId, id), eq(revisions.revision, p.revision)),
      )
      .limit(1);
    if (!snapshot) throw new Error("Missing project revision");
    const exports = await db
      .select({
        id: exportsTable.id,
        revision: exportsTable.revision,
        createdAt: exportsTable.createdAt,
        brief: exportsTable.brief,
        acknowledgment: exportsTable.acknowledgment,
      })
      .from(exportsTable)
      .where(eq(exportsTable.projectId, id))
      .orderBy(desc(exportsTable.createdAt))
      .limit(50);
    return {
      id: p.id,
      title: p.title,
      revision: p.revision,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      state: stateSchema.parse(snapshot.state),
      exports: exports.map((e) => ({ ...e, stale: e.revision !== p.revision })),
      canReview: true,
    };
  }
  async function mutate(
    id: string,
    expectedRevision: number,
    event: string,
    update: (state: ProjectState) => ProjectState,
    ctx: ActionRunContext,
  ) {
    return db.transaction(async (tx) => {
      const [p] = await tx
        .select()
        .from(projects)
        .where(scoped(id, ctx))
        .for("update")
        .limit(1);
      if (!p)
        return errors.fail(
          "Project not found or not available to this account.",
          "not_found",
          { statusCode: 404 },
        );
      if (p.revision !== expectedRevision)
        errors.fail(
          "This project changed. Reload the current revision before saving.",
          "stale_revision",
          { statusCode: 409, details: { currentRevision: p.revision } },
        );
      if (p.revision >= 500)
        errors.fail(
          "This project reached the local review limit of 500 revisions. Export its record and start a new project.",
          "limit_reached",
        );
      const [previous] = await tx
        .select({ state: revisions.state })
        .from(revisions)
        .where(
          and(eq(revisions.projectId, id), eq(revisions.revision, p.revision)),
        )
        .limit(1);
      if (!previous) throw new Error("Missing project revision");
      const state = stateSchema.parse(
        update(stateSchema.parse(previous.state)),
      );
      const at = new Date().toISOString(),
        revision = p.revision + 1;
      await tx
        .insert(revisions)
        .values({
          projectId: id,
          revision,
          ownerEmail: p.ownerEmail,
          orgId: p.orgId,
          state,
          event,
          actor: requireIdentity(ctx),
          caller: ctx.caller,
          createdAt: at,
        });
      await tx
        .update(projects)
        .set({ revision, updatedAt: at })
        .where(and(scoped(id, ctx), eq(projects.revision, expectedRevision)));
      return { id, revision };
    });
  }
  async function produceExport(
    id: string,
    expectedRevision: number,
    ctx: ActionRunContext,
  ) {
    return db.transaction(async (tx) => {
      const [p] = await tx
        .select()
        .from(projects)
        .where(scoped(id, ctx))
        .for("update")
        .limit(1);
      if (!p)
        return errors.fail(
          "Project not found or not available to this account.",
          "not_found",
          { statusCode: 404 },
        );
      if (p.revision !== expectedRevision)
        errors.fail(
          "The export would use an old revision. Reload first.",
          "stale_revision",
          { statusCode: 409 },
        );
      const [snapshot] = await tx
        .select()
        .from(revisions)
        .where(
          and(
            eq(revisions.projectId, id),
            eq(revisions.revision, expectedRevision),
          ),
        )
        .limit(1);
      if (!snapshot) throw new Error("Missing project revision");
      const count = await tx
        .select({ id: exportsTable.id })
        .from(exportsTable)
        .where(eq(exportsTable.projectId, id))
        .limit(50);
      if (count.length >= 50)
        errors.fail(
          "This project has reached its 50-export limit.",
          "limit_reached",
        );
      const result = {
        id: crypto.randomUUID(),
        projectId: id,
        revision: expectedRevision,
        ...composeExport(
          p.title,
          expectedRevision,
          stateSchema.parse(snapshot.state),
        ),
        ownerEmail: p.ownerEmail,
        orgId: p.orgId,
        createdAt: new Date().toISOString(),
      };
      await tx.insert(exportsTable).values(result);
      return {
        id: result.id,
        revision: result.revision,
        createdAt: result.createdAt,
        brief: result.brief,
        acknowledgment: result.acknowledgment,
        stale: false,
      };
    });
  }
  return { create, list, get, mutate, produceExport };
}
export const store = () => createStore(getDb());
