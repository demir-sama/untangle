import { runMigrations } from "@agent-native/core/db";

import { UNTANGLE_SQL } from "../db/migrations.js";
export default runMigrations(
  [{ version: 1, name: "untangle-private-revision-store", sql: UNTANGLE_SQL }],
  { table: "untangle_migrations" },
);
