import { defineAction, defineActionErrors } from "@agent-native/core/action";
import { writeAppStateForCurrentTab } from "@agent-native/core/application-state";
import { z } from "zod";
export const safeNavigationPath = (path: string) =>
  /^\/(?:projects(?:\/[a-f0-9-]{36})?|chat(?:\/[a-zA-Z0-9_-]+)?|home|about|guide|privacy)\/?$/.test(
    path,
  );
const errors = defineActionErrors("invalid_navigation");
export default defineAction({
  description:
    "Open an Untangle workspace or information page using a same-app navigation command. External URLs, settings changes and executable schemes are not allowed.",
  schema: z.object({
    view: z
      .enum(["projects", "chat", "home", "about", "guide", "privacy"])
      .optional()
      .describe("App view"),
    path: z
      .string()
      .max(200)
      .refine(safeNavigationPath, "Use a known same-app path only")
      .optional()
      .describe("Known local Untangle route, never an external URL"),
    projectId: z
      .string()
      .uuid()
      .optional()
      .describe("Project when opening projects view"),
    threadId: z
      .string()
      .regex(/^[a-zA-Z0-9_-]+$/)
      .max(120)
      .optional()
      .describe("Chat thread ID"),
  }),
  outputSchema: z.object({ navigatingTo: z.string() }),
  errors,
  http: false,
  run: async (args) => {
    if (!args.view && !args.path)
      return errors.fail("Provide a known view or path.", "invalid_navigation");
    const nav: Record<string, string> = {};
    if (args.view) nav.view = args.view;
    if (args.path) nav.path = args.path;
    if (args.projectId) nav.projectId = args.projectId;
    if (args.threadId) nav.threadId = args.threadId;
    nav._writeId = crypto.randomUUID();
    await writeAppStateForCurrentTab("navigate", nav);
    return { navigatingTo: args.path ?? args.view ?? "projects" };
  },
});
