import { defineAction } from "@agent-native/core/action";
import { z } from "zod";

import { errors, requireIdentity } from "../server/domain/rules.js";
import { store } from "../server/domain/store.js";
import { projectViewSchema } from "../shared/untangle.js";
export default defineAction({
  description:
    "Read current project revision, exact sources, findings, human decisions and whether previous exports are stale. Always read before writing.",
  schema: z.object({ id: z.string().uuid().describe("Project ID") }),
  outputSchema: projectViewSchema,
  errors,
  http: { method: "GET" },
  readOnly: true,
  persistInBrowser: false,
  run: async ({ id }, ctx = { caller: "tool" }) => store().get(id, ctx),
});
