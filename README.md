# Untangle

**Evidence first. People decide.**

Untangle is a private decision desk for project leads and client-facing teams reconciling later instructions with an agreed brief. It is not a generic feedback board or an automatic approval engine.

Keep original source wording, stage atomic findings with exact quotations, review the interpretation, and record an explicit direction. Export a revision-stamped execution brief and acknowledgment draft. Reopening a decision or adding new information marks previous exports stale. Nothing is sent to a client.

## Working product scope

- Real Builder.io **Agent-Native** standalone application (`@agent-native/core` 0.226.0), not chat bolted onto independent CRUD.
- UI and assistant share typed actions and the same SQL state.
- Private reviewer/organization isolation; immutable source records and revision snapshots.
- Side-by-side source-linked evidence; server rejects invented quotations and duplicate evidence/type findings.
- Provisional interpretations with explicit limits; narrow lexical checks reject an agent's unsupported quoted/quantified details, **not** arbitrary semantic hallucinations.
- Reviewer correction of open interpretations; accepted/rejected decisions must be reopened before editing.
- Human outcomes, decision-owner labels, rationale, accepted direction and preserved history. Agent decision/edit calls require the framework's exact-call human approval gate.
- Revision-bound Markdown brief/reply drafts, incomplete/unlinked-source warnings and stale status.
- Original knot-to-line vector identity, responsive/container-aware layout, keyboard-native forms, zoom support, visible errors/loading states, public About/Guide/Privacy pages.

The free local model is real but limited. Initial smoke test: 3/6 classifications. Revised test: 9/12, with only 4/6 new holdouts and an invented rationale despite valid quotes. A later question-framing experiment scored 13/20 classifications, with 18/20 valid exact-quote results and two parse failures; it did not validate reliable question framing. Do not mistake source matching or a nicer interface for verified reasoning. [Evaluation record](docs/EVALUATION.md).

## Local setup

Use the pinned Node 24.x (this installation was tested on 24.22.1), Corepack and the repository-pinned pnpm 10.29.1.

```sh
corepack enable
pnpm install
pnpm dev
```

Normal native dependency installation may need a C/C++ toolchain and make. This box lacks make and its official apt repository fetch failed; installation here used `pnpm install --ignore-scripts`. Web operation works, but optional terminal PTY does not. Arbitrary agent code execution is disabled. This workaround is not an all-feature clean installation.

The current development service uses port 8092. The framework uses a canonical origin for cookies: do not interchange localhost and its private IP. On the sign-in screen select **Continue as local dev** through the normal framework flow; it creates a real Better Auth development session, not an auth bypass. No provider key is needed for local inference. Do not disable authentication to get a demo working.

**Local bot-browser preview is blocked by an intentional loopback/private-network restriction.** The normal hosted preview is available at https://untangle-ten.vercel.app; HTTP 200 is not rendered-browser verification. See [preview access and auth prerequisites](docs/PREVIEW-ACCESS.md). Do not modify browser/network security controls or expose a development identity to obtain screenshots.

## Free local model

Only explicit non-hosted development selects supported `ai-sdk:ollama` at `http://127.0.0.1:11439`, model `untangle-qwen`. Run Ollama on the app host, not in the visitor's browser:

```sh
OLLAMA_HOST=127.0.0.1:11439 ollama serve
# In another terminal, after preparing the model file below:
OLLAMA_HOST=127.0.0.1:11439 ollama create untangle-qwen -f models/Modelfile.example
```

Edit the example FROM path to an actual downloaded official model file first. The verified distribution is [Qwen/Qwen3-1.7B-GGUF](https://huggingface.co/Qwen/Qwen3-1.7B-GGUF), revision `90862c4b9d2787eaed51d12237eafdfe7c5f6077`, `Qwen3-1.7B-Q8_0.gguf` (about 1.83GB, Apache-2.0). Verify its digest against official LFS metadata before importing. Provenance/digest: [model-provenance.json](benchmarks/model-provenance.json). [Official Ollama import guide](https://docs.ollama.com/import).

Weights/runtime stay outside git. No account, paid API, copied credentials or blocked download route is required for the successful documented import. CPU inference is slower than a hosted large model and does not guarantee correct classification. Changing the provider requires a deliberate privacy/auth/deployment review.

## Verify

```sh
pnpm typecheck
pnpm exec agent-native doctor
pnpm test
pnpm build
# Requires the local Ollama service; isolated memory database, no account created:
DATABASE_URL=pglite:memory pnpm exec tsx benchmarks/action-roundtrip.ts
python3 benchmarks/evaluate-v3.py
```

On this box, prefix pnpm commands with `COREPACK_HOME=/workspace/untangle-runtime/corepack` because its default Corepack cache is not writable. Use `DO_NOT_TRACK=1 AGENT_NATIVE_TELEMETRY_DISABLED=1` to disable CLI telemetry.

Tests use actual in-memory PGlite/Drizzle, not a fake persistence adapter. Build/typecheck/test evidence is not proof of a working browser flow. [Verification status](docs/VERIFICATION.md).

## Documentation

- [User guide](docs/USER-GUIDE.md) · in-app `/guide`
- [Architecture/action/data contract](docs/ARCHITECTURE.md)
- [Security, privacy and limits](docs/SECURITY.md) · in-app `/privacy`
- [Model evaluation and reproducibility](docs/EVALUATION.md)
- [Feasibility/dependency record](docs/FEASIBILITY.md)
- [Browser preview restriction](docs/PREVIEW-ACCESS.md)
- [Honest demo runbook](docs/DEMO.md)

## What is not finished or promised

Public preview: https://untangle-ten.vercel.app, served by Vercel Hobby with persistent Neon Free PostgreSQL. HTTP health reports ready/database true and anonymous private action requests return 401. Parent-reported desktop QA exercised real native inference, persisted findings, human clarification, stale snapshots, draft downloads and a contextual follow-up. Mobile viewport and assistive-technology testing remain unverified. No reliable autonomous decisions, verified stakeholder authority, team sharing, self-service data deletion, contract interpretation, external sending or compliance claims. One working desktop flow is not a model accuracy benchmark or production readiness guarantee. See [verification scope](docs/VERIFICATION.md).

The hosted preview uses normal Better Auth account sessions and a dedicated persistent SQL database; it never calls the development Ollama endpoint. The normal native setup connected an existing Builder Free account for the observed desktop comparison and follow-up. Future visitors must connect their own supported provider/account and check current free entitlement; no balance, model identity or ongoing availability is promised. No paid fallback or top-up is part of this preview. See [hosted deployment details](docs/HOSTED-PREVIEW-PLAN.md).

## Credits and licenses

Built with the actual [Agent-Native framework](https://www.agent-native.com/docs/), React Router, React, Drizzle and PostgreSQL (PGlite for local development). Dependency licenses remain their respective owners'. Qwen model weights are separately licensed Apache-2.0 and are not included. Original Untangle logo/assets are in `public/brand/`. This README does not imply Builder.io endorsement or a license grant over unrelated framework/dependency assets.
