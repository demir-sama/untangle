# Architecture and action contract

## Genuine agent-native state/action boundary

```text
React typed action hooks ─┐
                         ├─ defineAction + validation + request identity
Native framework agent ──┘       │
                                 ├─ deterministic domain rules
                                 └─ scoped Drizzle transaction → PostgreSQL/PGlite
                                                       │
                         UI refetch/live sync ← result/revision snapshots
```

AI orchestration stays in the framework chat engine. CRUD/domain actions contain no hidden model calls. UI navigation publishes projectId; `view-screen` reads the selected project's fresh SQL snapshot, not a stale DOM summary. The contextual native assistant remains beside the decision desk. `focusAgentChat` is the toolkit's public sidebar API; no custom parallel chat backend exists.

## Typed actions

All normal application data uses `actions/*.ts`, generated action types and the framework router at `/_agent-native/actions/:name`. These are not unauthenticated public APIs. The framework owns transport/auth; do not mint or copy sessions for tests.

| Action                 | Contract                                                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| create-project         | Immutable baseline; creator owns private reviewer resource.                                                                                                  |
| list-projects          | Scoped owner AND exact organization context; bounded to 50.                                                                                                  |
| get-project            | Latest typed state/revision, review capability and up to 50 saved exports with computed stale status.                                                        |
| append-source          | Immutable incoming wording; expectedRevision; max 20 sources.                                                                                                |
| propose-findings       | Exact source quotations; no human decisions; max 12 per action/80 total. Conflicts need baseline and instruction evidence. Agent-origin derived server-side. |
| edit-finding           | Reviewer-gated correction of open/needs-answer title/type/interpretation, preserving evidence/origin; accepted/rejected must reopen.                         |
| review-finding         | Reviewer-gated outcome/owner/rationale/explicit accepted direction; never auto-approves.                                                                     |
| export-brief           | Deterministic immutable revision-stamped brief + acknowledgment draft; no sending.                                                                           |
| view-screen / navigate | Framework navigation context/current selected project; not another data store.                                                                               |

`needsApproval:true` protects decision/edit tool calls with the framework's exact-call approval binding. The trusted server caller context, not a user-supplied field, determines agent versus UI origin. The domain guard rejects tool callers without the framework approval capability. Raw SQL/code, arbitrary provider APIs and unrelated settings actions are not exposed in the app agent's restricted action registry. Code execution/bridge tools/delegation are disabled.

## SQL

- `untangle_projects`: resource owner, organization, title, current revision and timestamps.
- `untangle_revisions`: compound project/revision key, typed JSONB snapshot, event, actor, caller and timestamp. Append-only through domain store.
- `untangle_exports`: immutable generated text and the originating project revision.

Every write transaction locks the project row, verifies owner/org and expected revision, appends a validated snapshot, then advances current revision. Concurrent writers cannot both succeed against the same expected revision. A rejected write rolls back. Maximum 500 revisions/project and 50 exports bound resource use. Sources/findings/review histories and text lengths are bounded.

Exports do not mutate the project revision; export currency is computed by comparison with the current project revision. Old file contents are never rewritten. Later decisions, correction or sources invalidate previous currency. No findings or missing source links do not establish a completed review.

Local persistence is PGlite at data/pglite. Hosting requires durable PostgreSQL, authentication and deployment-specific migrations; local ephemeral serverless files are not an acceptable production database.

## Inference and tests

The official local Ollama engine is resolved through the framework's high-level `resolveEngine` policy. Do not directly inject raw fetch/disable SSRF guards. The app's current local-only plugin configuration is explicit; see README/FEASIBILITY for installation and non-cloud limits.

Unit/integration tests use real PGlite + Drizzle. The model benchmark is opt-in and records raw results. `benchmarks/action-roundtrip.ts` exercises the actual shared action with model-generated arguments and isolated memory SQL. It does not pretend a test fixture identity is a browser session.
