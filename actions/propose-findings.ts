import { defineAction } from "@agent-native/core/action";
import { z } from "zod";

import { errors, requireIdentity } from "../server/domain/rules.js";
import { appendFindings } from "../server/domain/rules.js";
import { store } from "../server/domain/store.js";
import { revisionInput, proposedFindingSchema } from "../shared/untangle.js";
export default defineAction({
  description:
    "Save proposed findings with exact source quotes. Does NOT approve anything. Baseline conflicts require evidence from baseline and instruction. Fails if quotes are invented or duplicate.",
  schema: revisionInput.extend({
    findings: z
      .array(proposedFindingSchema)
      .min(1)
      .max(12)
      .describe(
        "Up to 12 proposed findings. Every quote must match an existing source verbatim.",
      ),
  }),
  outputSchema: z.object({ id: z.string().uuid(), revision: z.number().int() }),
  errors,
  run: async ({ id, expectedRevision, findings }, ctx = { caller: "tool" }) =>
    store().mutate(
      id,
      expectedRevision,
      "findings_proposed",
      (state) => {
        if (state.findings.length + findings.length > 80)
          errors.fail("Limit: 80 findings per project.", "limit_reached");
        return appendFindings(
          state,
          findings.map((f) => ({
            ...f,
            id: crypto.randomUUID(),
            proposedBy: ["http", "frontend"].includes(ctx.caller)
              ? ("person" as const)
              : ("agent" as const),
            reviews: [],
          })),
        );
      },
      ctx,
    ),
});
