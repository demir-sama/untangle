import { defineAction } from "@agent-native/core/action";
import { readAppState } from "@agent-native/core/application-state";
import { z } from "zod";

import { store } from "../server/domain/store.js";
import { projectViewSchema } from "../shared/untangle.js";
export default defineAction({
  description:
    "Read current navigation and the selected Untangle project's latest sources, findings, human decisions and export status.",
  schema: z.object({}),
  outputSchema: z.object({
    navigation: z.unknown(),
    project: projectViewSchema.optional(),
  }),
  http: false,
  readOnly: true,
  run: async (_args, ctx = { caller: "tool" }) => {
    const navigation = await readAppState("navigation");
    const parsed = z
      .object({
        view: z.string().optional(),
        projectId: z.string().uuid().optional(),
      })
      .safeParse(navigation);
    const project =
      parsed.success && parsed.data.projectId
        ? await store().get(parsed.data.projectId, ctx)
        : undefined;
    return { navigation: navigation ?? null, project };
  },
});
