# User guide

## The point of the desk

A later request is not an agreement. Untangle preserves the distinction between original wording, a possible interpretation and a reviewer-recorded direction. Start at `/projects`; public help pages are `/guide`, `/about`, `/privacy`.

1. **Save the original baseline.** Include scope, constraints and exclusions. Identify its source and reported author. Saved sources are immutable; do not silently change a baseline. Use a new project if the original record itself is wrong.
2. **Add incoming instructions.** Paste original text, not an AI summary. Author labels are not verified authority. One source may contain multiple requests. Text input only; no inboxes, URL scraping or attachment extraction.
3. **Compare the evidence.** Open the native contextual assistant without leaving the project, or add a finding manually. Each issue should be atomic. Copy contiguous quotations exactly. Possible conflicts require both baseline and incoming evidence.
4. **Check the interpretation.** The UI labels it unverified. Quote matching does not establish that a contradiction exists. Correct an open title/type/interpretation if needed; the original evidence stays intact and a new revision records the correction. To change an accepted/rejected interpretation, reopen first.
5. **Record your decision.** Keep open, ask for clarification, accept an explicit direction or decline. Decision-owner label and rationale are required. Accepting needs a concrete execution direction. It records your action, not approval by a named stakeholder.
6. **Prepare and inspect drafts.** Execution brief and acknowledgment are tied to one project revision. Unresolved findings and instructions with no linked finding are flagged incomplete. A linked source is not proof all its requests were found. Nothing is sent.
7. **Reopen when facts change.** History remains. Any later mutation marks old saved exports stale. Downloaded files cannot revoke/update themselves; check the current project before relying on them.

## Classification is provisional

- Possible conflict: a later instruction may contradict an explicit baseline constraint or permission.
- Possible added scope: a new concrete deliverable may be outside the baseline without necessarily being prohibited.
- Needs clarification: an unanswered choice, vague intent or missing acceptance criterion.
- Apparently aligned: seems consistent; not a verified approval.

No confidence scores are invented. Small-model mistakes are openly reported in [EVALUATION](EVALUATION.md).

## Recover without losing the record

- Stale revision: refresh, inspect the current state, retry deliberately. The failed transaction leaves no partial revision.
- Invalid quote: copy an exact contiguous passage including punctuation; do not paraphrase.
- Agent interpretation rejected: remove unsupported quoted claims/quantified commitments. The lexical check is narrow; ordinary unquoted reasoning can still be wrong.
- Assistant unavailable: manual source review, correction, decisions and export do not require inference.
- Authentication: normal Better Auth sign-in is required. In localhost development use Continue as local dev; cookie-less API calls are not a browser session.

## Privacy and retention

Use synthetic/non-sensitive data in this prototype. Source text, decisions, immutable snapshots, exports and framework chat can remain on disk. No per-project permanent deletion interface is implemented. Read [SECURITY](SECURITY.md) before real client material.
