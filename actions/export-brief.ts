import { defineAction } from "@agent-native/core/action";
import { z } from "zod";

import { errors, requireIdentity } from "../server/domain/rules.js";
import { store } from "../server/domain/store.js";
import { revisionInput, exportSchema } from "../shared/untangle.js";
export default defineAction({
  description:
    "Save a deterministic execution brief and draft acknowledgment for the exact current revision. Open findings stay explicitly unresolved. Never sends anything. Later project changes make this export stale.",
  schema: revisionInput,
  outputSchema: exportSchema,
  errors,
  run: async ({ id, expectedRevision }, ctx = { caller: "tool" }) =>
    store().produceExport(id, expectedRevision, ctx),
});
