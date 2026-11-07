import { defineAction } from "@agent-native/core/action";
import { z } from "zod";

import { errors, requireIdentity } from "../server/domain/rules.js";
import { store } from "../server/domain/store.js";
import { projectSchema } from "../shared/untangle.js";
export default defineAction({
  description:
    "List up to 50 private projects owned by the signed-in reviewer in the current organization.",
  schema: z.object({}),
  outputSchema: z.array(projectSchema),
  errors,
  http: { method: "GET" },
  readOnly: true,
  persistInBrowser: false,
  run: async (_args, ctx = { caller: "tool" }) => store().list(ctx),
});
