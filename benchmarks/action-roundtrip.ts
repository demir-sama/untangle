/** Integration proof, not an end-user accuracy benchmark. Uses isolated in-memory SQL. */
import { writeFile } from "node:fs/promises";
if (process.env.DATABASE_URL !== "pglite:memory")
  throw new Error("Benchmark requires isolated DATABASE_URL=pglite:memory");
const { default: migrate } = await import("../server/plugins/db.js");
const { resolveEngine, registerBuiltinEngines } =
  await import("@agent-native/core/agent/engine");
const { default: create } = await import("../actions/create-project.js");
const { default: append } = await import("../actions/append-source.js");
const { default: propose } = await import("../actions/propose-findings.js");
const { default: get } = await import("../actions/get-project.js");
await migrate();
const ctx = {
  caller: "frontend" as const,
  userEmail: "benchmark@example.test",
  orgId: null,
};
const created = await create.run(
  create.schema!.parse({
    title: "Synthetic integration fixture",
    label: "Agreed brief",
    author: "Sponsor",
    baseline: "Launch in English only.",
  }),
  ctx,
);
await append.run(
  append.schema!.parse({
    id: created.id,
    expectedRevision: 1,
    label: "Follow-up",
    author: "Stakeholder",
    text: "Add French for launch.",
  }),
  ctx,
);
const before = await get.run({ id: created.id }, ctx);
registerBuiltinEngines();
const engine = await resolveEngine({
  engineOption: {
    name: "ai-sdk:ollama",
    config: { baseUrl: "http://127.0.0.1:11439" },
  },
  model: "untangle-qwen",
});
const events: unknown[] = [];
const calls: unknown[] = [];
const started = performance.now();
for await (const event of engine.stream({
  model: "untangle-qwen",
  systemPrompt:
    "You are Untangle. Use propose-findings to record conflicts between the agreed baseline and incoming instructions. Copy evidence quotes exactly. All findings are provisional for human review. Never approve anything. /no_think",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: `Analyze this synthetic project and call propose-findings once with one conflict, citing both source IDs and their exact quotes. Current project: ${JSON.stringify(before)}`,
        },
      ],
    },
  ],
  tools: [
    {
      name: "propose-findings",
      description: propose.tool.description,
      inputSchema: propose.tool.parameters as any,
    },
  ],
  abortSignal: AbortSignal.timeout(90000),
  maxOutputTokens: 700,
  temperature: 0,
  providerOptions: { ollama: { think: false, numCtx: 4096, numThread: 4 } },
})) {
  events.push(event);
  if (event.type === "error") throw new Error(JSON.stringify(event));
  if (event.type === "tool-call") {
    if (event.name !== "propose-findings") throw new Error("Unexpected tool");
    const parsed = propose.schema!.parse(event.input);
    const output = await propose.run(parsed, { ...ctx, caller: "tool" });
    calls.push({ name: event.name, input: parsed, output });
  }
}
const after = await get.run({ id: created.id }, ctx);
const result = {
  model: "untangle-qwen",
  framework: "@agent-native/core 0.226.0 resolveEngine",
  scope: "Isolated engine/action/SQL harness, not browser chat verification",
  seconds: Math.round((performance.now() - started) / 10) / 100,
  toolCalls: calls,
  sqlRevision: after.revision,
  findings: after.state.findings,
  events,
  passed:
    after.revision === 3 &&
    after.state.findings.length === 1 &&
    after.state.findings[0].reviews.length === 0,
};
await writeFile(
  "benchmarks/action-roundtrip-results.json",
  JSON.stringify(result, null, 2),
);
console.log(
  JSON.stringify(
    {
      passed: result.passed,
      seconds: result.seconds,
      sqlRevision: result.sqlRevision,
      toolCalls: calls.length,
      findings: result.findings,
    },
    null,
    2,
  ),
);
process.exit(result.passed ? 0 : 1);
