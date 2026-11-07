import {
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
} from "drizzle-orm/pg-core";

import type { ProjectState } from "../../shared/untangle.js";
export const projects = pgTable(
  "untangle_projects",
  {
    id: text("id").primaryKey(),
    ownerEmail: text("owner_email").notNull(),
    orgId: text("org_id"),
    title: text("title").notNull(),
    revision: integer("revision").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => [index("untangle_projects_owner_idx").on(t.ownerEmail, t.orgId)],
);
export const revisions = pgTable(
  "untangle_revisions",
  {
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id),
    revision: integer("revision").notNull(),
    ownerEmail: text("owner_email").notNull(),
    orgId: text("org_id"),
    state: jsonb("state").$type<ProjectState>().notNull(),
    event: text("event").notNull(),
    actor: text("actor").notNull(),
    caller: text("caller").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.projectId, t.revision] })],
);
export const exportsTable = pgTable(
  "untangle_exports",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id),
    revision: integer("revision").notNull(),
    ownerEmail: text("owner_email").notNull(),
    orgId: text("org_id"),
    brief: text("brief").notNull(),
    acknowledgment: text("acknowledgment").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (t) => [index("untangle_exports_project_idx").on(t.projectId)],
);
