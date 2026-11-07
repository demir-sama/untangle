import { defineAction } from "@agent-native/core/action";
import { z } from "zod";

import { errors, requireIdentity } from "../server/domain/rules.js";
import { store } from "../server/domain/store.js";
import { projectSchema } from "../shared/untangle.js";
export default defineAction({
  description:
    "Create a private project from an agreed baseline. The creator is its reviewer; supplied author labels are not verified identities.",
  schema: z.object({
    title: z.string().trim().min(1).max(120).describe("Project name"),
    baseline: z
      .string()
      .trim()
      .min(1)
      .max(12000)
      .describe("Exact agreed baseline text, never an AI summary"),
    label: z.string().trim().min(1).max(160).describe("Baseline source label"),
    author: z
      .string()
      .trim()
      .min(1)
      .max(120)
      .describe("Source author label, not a permission grant"),
  }),
  outputSchema: projectSchema,
  errors,
  authorize: (_args, ctx = { caller: "tool" }) => {
    if (ctx) requireIdentity(ctx);
    else errors.fail("Sign in first.", "unauthenticated", { statusCode: 401 });
  },
  run: async (args, ctx = { caller: "tool" }) =>
    store().create(
      crypto.randomUUID(),
      args.title,
      args.label,
      args.author,
      args.baseline,
      ctx,
    ),
});
