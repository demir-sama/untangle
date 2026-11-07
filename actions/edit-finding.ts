import { defineAction } from "@agent-native/core/action";
import { z } from "zod";

import {
  errors,
  editInterpretation,
  requireHumanReview,
  requireIdentity,
} from "../server/domain/rules.js";
import { store } from "../server/domain/store.js";
import { revisionInput, findingKind } from "../shared/untangle.js";
export default defineAction({
  description:
    "Correct an open finding's interpretation without rewriting its original evidence. Reviewer-only. Reopen accepted or rejected decisions first; editing creates an immutable project revision.",
  schema: revisionInput.extend({
    findingId: z.string().uuid().describe("Finding to correct"),
    title: z
      .string()
      .trim()
      .min(1)
      .max(160)
      .describe("Reviewer-corrected title"),
    kind: findingKind.describe("Reviewer-corrected provisional type"),
    explanation: z
      .string()
      .trim()
      .min(1)
      .max(2000)
      .describe("Reviewer interpretation; not verified external approval"),
  }),
  outputSchema: z.object({ id: z.string().uuid(), revision: z.number().int() }),
  errors,
  needsApproval: true,
  run: async ({ id, expectedRevision, ...input }, ctx = { caller: "tool" }) => {
    requireHumanReview(ctx);
    return store().mutate(
      id,
      expectedRevision,
      "finding_edited",
      (state) =>
        editInterpretation(
          state,
          input,
          requireIdentity(ctx),
          new Date().toISOString(),
        ),
      ctx,
    );
  },
});
