import { defineAction } from "@agent-native/core/action";
import { z } from "zod";

import { errors, requireIdentity } from "../server/domain/rules.js";
import { requireHumanReview, reviewFinding } from "../server/domain/rules.js";
import { store } from "../server/domain/store.js";
import { revisionInput, outcome } from "../shared/untangle.js";
export default defineAction({
  description:
    "Reviewer-only decision or reopen. Human approval of this exact call is required when used by an agent. Record the decision owner, rationale and explicit execution direction for acceptance. Never infer stakeholder approval.",
  needsApproval: true,
  schema: revisionInput.extend({
    findingId: z.string().uuid().describe("Finding ID"),
    outcome: outcome.describe(
      "accepted, rejected, needs_answer, or open to reopen",
    ),
    owner: z
      .string()
      .trim()
      .min(1)
      .max(120)
      .describe(
        "Named decision owner; a label, not a verified approval by that person",
      ),
    rationale: z
      .string()
      .trim()
      .min(1)
      .max(2000)
      .describe("Reviewer's decision rationale"),
    direction: z
      .string()
      .trim()
      .max(3000)
      .default("")
      .describe(
        "Explicit agreed execution direction, required for accepted; empty otherwise",
      ),
  }),
  outputSchema: z.object({ id: z.string().uuid(), revision: z.number().int() }),
  errors,
  run: async ({ id, expectedRevision, ...input }, ctx = { caller: "tool" }) => {
    requireHumanReview(ctx);
    return store().mutate(
      id,
      expectedRevision,
      "finding_reviewed",
      (state) =>
        reviewFinding(
          state,
          input,
          requireIdentity(ctx),
          new Date().toISOString(),
        ),
      ctx,
    );
  },
});
