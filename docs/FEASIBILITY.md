# Untangle — verified core checkpoint

## Framework and running application

Official standalone Chat scaffold: `@agent-native/core@0.226.0`; Node 24.22.1; pinned pnpm 10.29.1. Local app: http://localhost:8092/projects (HTTP 200). Parent browser QA is still required; no rendered/mobile/accessibility claim yet.

The UI and agent share typed `defineAction` contracts, not duplicate CRUD routes. Actual SQL is authoritative; navigation state identifies the selected project. Private reviewer-owned projects have immutable source records and SQL revision snapshots. Every mutation locks the parent row and checks expectedRevision. Exports preserve their original text and revision; later changes/reopening mark them stale. Exact-substring evidence is required, including baseline and incoming evidence for conflicts. Reviewer decisions require owner label, rationale, explicit accepted direction, and the authenticated actor. Agent decisions require the framework's exact-call human approval capability. Author/owner labels are not verified authority. There is no team sharing in this slice, legal approval, or auto-send.

## Real, free local inference

Ollama 0.40.15 runs CPU-only at http://127.0.0.1:11439. Its registry pull redirected to an R2 storage domain rejected by the network; that route was not retried or bypassed.

A separate official Qwen distribution was downloaded normally from https://huggingface.co/Qwen/Qwen3-1.7B-GGUF (revision 90862c4b9d2787eaed51d12237eafdfe7c5f6077; Q8_0; about 1.83GB; Apache-2.0). SHA256 was checked against the official repository's LFS metadata; see `benchmarks/model-provenance.json`. Imported as `untangle-qwen` with the documented GGUF import workflow: https://docs.ollama.com/import . Weights/runtime are outside the project at `/workspace/untangle-runtime`, not checked into git. No signup, key, credits, payment, or unrelated app credentials were used.

### Measured limits — not production accuracy

- Initial six synthetic classification/evidence cases: **3/6** correct classifications, **6/6** exact quotes; median **2.785s** (first cold case 4.93s).
- Explicit classification-priority prompt, original six plus six new holdouts: **9/12** correct classifications, **12/12** exact quotes; median **2.58s**. This is **5/6** on reused cases and **4/6** holdouts, not an independent 75% production accuracy estimate. It still mishandled a vague request, an added deliverable, and a question; one explanation invented a baseline prohibition despite copying a valid quote. Exact quotation does NOT establish sound reasoning.
- Real `@agent-native/core` engine → generated model tool call → the actual `propose-findings` action → isolated PGlite SQL: **passed**, one tool call, **15.81s**. It saved one evidence-backed conflict at revision 3 with `proposedBy: agent`, zero human reviews. Raw events/results: `benchmarks/action-roundtrip-results.json`. This is a direct engine/action integration harness, **not** full browser chat proof.

The native engine must be obtained with `registerBuiltinEngines()` + `resolveEngine()`, not directly instantiated with a raw loopback baseUrl. The high-level resolver applies its built-in trusted-self-hosted Ollama origin allowlisting and retains SSRF/redirect restrictions. Direct instantiation was rejected by the default network guard; no raw-fetch replacement or broad private-network exemption was introduced. Correct Ollama baseUrl is the origin, without `/api` (the provider appends its path).

The app plugin selects that same supported local Ollama engine/model only in explicit development outside Vercel. Hosted/production runtimes use the framework’s configured provider connection, never this local endpoint. See HOSTED-PREVIEW-PLAN.md for the outstanding free-account prerequisites. Full in-app chat context and multi-turn reliability remain unverified; its native context is larger than the compact benchmark. All model findings are provisional and require human review. No polished automatic-reconciliation claim is justified yet.

For a stronger model, the framework also supports a Builder connection through its own UI. Official https://www.builder.io/pricing lists Free at $0, 60 credits/month and 15/day maximum, with no on-demand credits on Free. Eligibility/remaining account credits have not been verified. Parent must handle any sign-in/account decision; do not promise credits or spend.

## Validation

Core tests exercise real in-memory PGlite/Drizzle transactions, private owner/org isolation, stale-write rollback, exact evidence validation, review protection/history, immutable stale exports, concurrent writes, and injection-safe export structure. Run:

```sh
COREPACK_HOME=/workspace/untangle-runtime/corepack pnpm test
COREPACK_HOME=/workspace/untangle-runtime/corepack pnpm typecheck
COREPACK_HOME=/workspace/untangle-runtime/corepack pnpm exec agent-native doctor
DATABASE_URL=pglite:memory COREPACK_HOME=/workspace/untangle-runtime/corepack pnpm exec tsx benchmarks/action-roundtrip.ts
COREPACK_HOME=/workspace/untangle-runtime/corepack pnpm build
```

Typecheck, clean framework doctor and all 31 tests passed after the export-hardening test/local model configuration. The latest production Node build also passed after those changes (log: `/workspace/untangle-runtime/build-polish.log`). No public repo, push, cloud deploy, external message or account signup was performed.

## Installation/deployment caveats and unfinished work

Native `node-pty` initially failed because `make` is missing. Official apt repository fetch returned HTTP 500; it was not routed around. `pnpm install --ignore-scripts` permits web operation, but the optional terminal PTY reports a missing binary. Domain agent code execution/bridge tools and delegation are disabled; the agent's action registry is restricted to project actions/navigation rather than arbitrary providers or settings. Scaffold optimizer/OpenTelemetry warnings remain.

This is a functional local core, not a finished product. Still needed: full native chat/browser QA, stronger model quality or a defensible constrained review experience, About/privacy/limitations pages, complete docs/onboarding, professional branding/UI refinement/mobile/accessibility verification and a public Clips demo. Local Ollama cannot be assumed reachable from Vercel; local PGlite cannot be assumed durable on serverless hosting. Cloud deployment needs persistent PostgreSQL, authentication and a supported reachable model provider. No deployment promise is made.

## Professional-product checkpoint

Original SVG brand, coherent light/dark/container-aware evidence-first desk, public About/Guide/Privacy, complete user/developer/security/evaluation documentation, keyboard/zoom/focus/scroll access, visible error/loading states and reviewer interpretation correction are implemented. These are implementation/static-test claims, not rendered browser verification. Generic provider/hello scaffold actions were removed, navigation is restricted to known local product paths, and source-only/missing-finding exports explicitly avoid claiming a completed review.

Browser access is intentionally blocked by a platform security change, confirmed in the official forum; see PREVIEW-ACCESS.md. Cookie-less domain HTTP calls also correctly require normal Better Auth sign-in. No auth/network controls were weakened. V3 question-framing experiment was worse on reused cases (13/20 overall, 7/8 fresh, 18/20 valid exact quotes, two parse failures) and is retained publicly. Full native browser chat and production readiness remain unproven.
