# Model evaluation — retain failures, avoid false confidence

Model: official Qwen3-1.7B Q8_0, Apache-2.0, imported into local Ollama as untangle-qwen. Four inference threads, 4096-token configured context, temperature 0, thinking off in compact benchmark requests. Digest/provenance in `benchmarks/model-provenance.json`.

## Recorded evidence

| Run                     | Cases            | Classifications | Exact quotes | Median request time |
| ----------------------- | ---------------- | --------------- | ------------ | ------------------- |
| Initial                 | 6 synthetic      | 3/6             | 6/6          | 2.785s              |
| Revised priority prompt | 6 reused + 6 new | 9/12            | 12/12        | 2.58s               |

The second run scored 5/6 reused cases and 4/6 new holdouts. It still misclassified a vague request, a new training guide and a clarification question. One rationale invented an explicit baseline prohibition absent from the text, despite a correct source quote. This is an observed failure, not a theoretical disclaimer.

Original raw files are retained: `local-model-initial-results.json`, `local-model-results.json`. Do not overwrite the record or call these tiny tuned smoke cases independent production accuracy.

A native framework engine → generated tool call → actual shared propose-findings action → isolated PGlite SQL run succeeded in 15.81s, one conflict at revision 3, with zero human reviews. `action-roundtrip-results.json` contains raw events/arguments. This proves a narrow tool/action/SQL path, not full authenticated HTTP chat, browser context, mobile UI or multi-turn reliability.

## Question-framing experiment: no validated improvement

V3 scored **13/20** classifications, **18/20** valid exact-quote outputs, median **3.465s**. Fresh smoke cases scored **7/8**; reused regressions only **6/12**. Two responses failed JSON parsing. Zero reasons passed the simple `endswith("?")` check; several copied policy examples or introduced irrelevant explanation. This run is not a reliability improvement and is not cherry-picked out of the report. A question mark would not establish correct reasoning anyway.

## Current prompt/guard work

V3 evaluation separately retains 12 regression cases and adds 8 fresh synthetic smoke cases frozen in `cases-v3-new.json`. Its prompt prioritizes actual clarification questions and subjective requests, distinguishes omitted deliverables from explicit prohibitions, and requests neutral reviewer questions instead of authoritative explanations. Results go to `local-model-v3-results.json`; the original two runs remain unchanged.

Question framing is not a semantic verification metric. A question can contain an unsupported premise. The product has no invented numerical confidence field. Every interpretation remains labeled unverified.

The action's narrow lexical guard checks quoted phrases and quantified commitments against cited passages. It can reject an invented quoted 'no' or absent $500/3-weeks detail. It cannot detect all unquoted hallucinations, inference errors, omitted requests or incorrect authority assumptions. Tests explicitly demonstrate this boundary.

## Reproduce

Run the local Ollama service/model documented in README, then:

```sh
python3 benchmarks/evaluate-v3.py
DATABASE_URL=pglite:memory pnpm exec tsx benchmarks/action-roundtrip.ts
```

The native roundtrip uses a synthetic in-memory test fixture, not production accounts or another app's identity. HTTP/browser chat still requires normal framework sign-in on a supported reachable origin. No auth/network controls are disabled for tests.
