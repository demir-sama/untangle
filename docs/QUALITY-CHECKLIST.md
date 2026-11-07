# Implementation quality review — scope matters

- Bounded state/list sizes; deterministic domain rules; typed action contracts; owner/org authorization in the store.
- No hidden inference inside actions, parallel shadow CRUD backend, canned AI responses, invented approvals or fabricated confidence.
- Same source/state/action authority for agent and UI; actual local tool/action/SQL integration rechecked after guards.
- Finding component keys change for that finding's review/correction, not every unrelated project revision, preserving in-progress reviewer drafts during other updates.
- Event-driven forms; framework query hooks; explicit refetch after mutation; input-preserving error messages and retries.
- Native label/input/select/textarea/button/details elements, meaningful headings, skip link/main target, keyboard-scrollable source/export regions, visible focus, 44px primary targets, zoom no longer disabled.
- Container queries adapt evidence pairs and source/decision columns to actual available width when the native assistant is open; single-column fallback exists.
- Original scalable SVG mark; local font assets; coherent paper/ink/forest light and dark tokens; no new animation requirement or remote font/image tracker.
- React text rendering + injection-safe Markdown export composition. No unsafe source HTML evaluation.
- Public informational pages do not mount the private workspace shell or register browser WebMCP actions; private actions remain session-protected.

These are source/static/integration-test checks, not rendered-browser, screen-reader, contrast-measurement or real-mobile verification. The intentional browser network restriction and normal-session boundary still block full-story QA; see PREVIEW-ACCESS/VERIFICATION. The small model also remains unreliable on interpretations, long context and instruction following. Do not call the product fully verified or production ready.
