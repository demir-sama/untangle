import { defineActionErrors } from "@agent-native/core/action";
import type { ActionRunContext } from "@agent-native/core/action";

import {
  effectiveOutcome,
  latestReview,
  stateSchema,
  type ProjectState,
  type Finding,
  type ReviewInput,
} from "../../shared/untangle.js";

export const errors = defineActionErrors(
  "unauthenticated",
  "not_found",
  "stale_revision",
  "invalid_evidence",
  "limit_reached",
  "review_required",
  "invalid_decision",
  "duplicate_finding",
);
export function requireIdentity(ctx: ActionRunContext): string {
  if (!ctx.userEmail)
    return errors.fail("Sign in before opening a project.", "unauthenticated", {
      statusCode: 401,
    });
  return ctx.userEmail;
}
export function requireHumanReview(ctx: ActionRunContext) {
  requireIdentity(ctx);
  if (!["frontend", "http"].includes(ctx.caller) && !ctx.approvedToolCallKey)
    errors.fail(
      "A reviewer must approve this exact decision in the app. The agent can only propose it.",
      "review_required",
      { statusCode: 403 },
    );
}
export function validateEvidence(
  state: ProjectState,
  finding: Pick<Finding, "evidence" | "kind">,
) {
  const sources = finding.evidence.map((e) => {
    const source = state.sources.find((s) => s.id === e.sourceId);
    if (!source || !e.quote.trim() || !source.text.includes(e.quote))
      return errors.fail(
        "Evidence must be an exact quote from a source in this project. Nothing was saved.",
        "invalid_evidence",
        { statusCode: 400 },
      );
    return source;
  });
  if (!sources.some((s) => s.kind === "instruction"))
    errors.fail("Link at least one incoming instruction.", "invalid_evidence");
  if (
    finding.kind === "conflict" &&
    !sources.some((s) => s.kind === "baseline")
  )
    errors.fail(
      "A baseline conflict needs exact evidence from both the baseline and incoming instruction.",
      "invalid_evidence",
    );
}
/** Narrow lexical guard only. It cannot validate an unquoted semantic interpretation. */
export function validateQuotedInterpretation(
  finding: Pick<Finding, "explanation" | "evidence">,
) {
  const passages = finding.evidence.map((e) => e.quote);
  const quoted = [
    ...finding.explanation.matchAll(
      /(?:"([^"\n]{2,})"|“([^”\n]{2,})”|(?:^|\s)'([^'\n]{2,})'(?:[\s.,;:!?]|$))/g,
    ),
  ].flatMap((m) => {
    const quote = m[1] ?? m[2] ?? m[3];
    return quote ? [quote] : [];
  });
  const quantified =
    finding.explanation.match(
      /[$€£]\s?\d[\d,.]*|\b\d+(?:\.\d+)?\s?(?:%|USD|EUR|NGN|hours?|days?|weeks?|months?)\b/g,
    ) ?? [];
  if (
    [...quoted, ...quantified].some(
      (claim) => !passages.some((p) => p.includes(claim)),
    )
  )
    errors.fail(
      "The interpretation includes a quoted claim or quantified detail absent from its cited passages. Remove unsupported details; keep uncertain reasoning as a question. Quote matching still does not verify interpretation.",
      "invalid_evidence",
      { statusCode: 400 },
    );
}
const findingSignature = (finding: Pick<Finding, "kind" | "evidence">) =>
  JSON.stringify([
    finding.kind,
    [...finding.evidence]
      .map(({ sourceId, quote }) => ({ sourceId, quote }))
      .sort(
        (a, b) =>
          a.sourceId.localeCompare(b.sourceId) ||
          a.quote.localeCompare(b.quote),
      ),
  ]);

export function editInterpretation(
  current: ProjectState,
  input: {
    findingId: string;
    title: string;
    kind: Finding["kind"];
    explanation: string;
  },
  actor: string,
  at: string,
) {
  const state = structuredClone(current);
  const finding = state.findings.find((f) => f.id === input.findingId);
  if (!finding)
    return errors.fail("Finding not found in this project.", "not_found", {
      statusCode: 404,
    });
  if (["accepted", "rejected"].includes(effectiveOutcome(finding)))
    return errors.fail(
      "Reopen the decision before changing its interpretation. Prior acceptance must not silently approve different wording.",
      "invalid_decision",
      { statusCode: 409 },
    );
  finding.title = input.title;
  finding.kind = input.kind;
  finding.explanation = input.explanation;
  finding.editedBy = actor;
  finding.editedAt = at;
  validateEvidence(state, finding);
  if (
    state.findings.some(
      (other) =>
        other.id !== finding.id &&
        findingSignature(other) === findingSignature(finding),
    )
  )
    return errors.fail(
      "Another finding already records this evidence and type.",
      "duplicate_finding",
      { statusCode: 409 },
    );
  return stateSchema.parse(state);
}
export function appendFindings(current: ProjectState, incoming: Finding[]) {
  const state = structuredClone(current);
  for (const finding of incoming) {
    validateEvidence(state, finding);
    if (finding.proposedBy === "agent") validateQuotedInterpretation(finding);
    if (
      state.findings.some(
        (f) => findingSignature(f) === findingSignature(finding),
      )
    )
      errors.fail(
        "This evidence already has a finding. Review it instead of adding a duplicate.",
        "duplicate_finding",
        { statusCode: 409 },
      );
    state.findings.push(finding);
  }
  return stateSchema.parse(state);
}
export function reviewFinding(
  current: ProjectState,
  input: ReviewInput,
  actor: string,
  at: string,
) {
  const state = structuredClone(current);
  const finding = state.findings.find((f) => f.id === input.findingId);
  if (!finding)
    return errors.fail("Finding not found in this project.", "not_found", {
      statusCode: 404,
    });
  if (input.outcome === "accepted" && !input.direction.trim())
    errors.fail(
      "Write the agreed execution direction before accepting. A title is not an approval.",
      "invalid_decision",
    );
  if (!input.owner.trim() || !input.rationale.trim())
    errors.fail(
      "A decision owner and rationale are required, including when reopening.",
      "invalid_decision",
    );
  finding.reviews.push({
    outcome: input.outcome,
    owner: input.owner,
    rationale: input.rationale,
    direction: input.outcome === "accepted" ? input.direction : "",
    actor,
    at,
  });
  return stateSchema.parse(state);
}
// Evidence is data even in exported Markdown: source text cannot forge headings or HTML.
const exportInline = (value: string) =>
  value
    .replace(/[\r\n]+/g, " ")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/([\\`*_{}\[\]()#+.!|~>-])/g, "\\$1");
const sourceBlock = (value: string) =>
  value
    .split(/\r?\n/)
    .map((line) => `    ${line}`)
    .join("\n");
export function composeExport(
  title: string,
  revision: number,
  state: ProjectState,
) {
  title = exportInline(title);
  const accepted = state.findings.filter(
    (f) => effectiveOutcome(f) === "accepted",
  );
  const rejected = state.findings.filter(
    (f) => effectiveOutcome(f) === "rejected",
  );
  const unresolved = state.findings.filter((f) =>
    ["open", "needs_answer"].includes(effectiveOutcome(f)),
  );
  const unlinked = state.sources.filter(
    (s) =>
      s.kind === "instruction" &&
      !state.findings.some((f) => f.evidence.some((e) => e.sourceId === s.id)),
  );
  const completeness =
    unresolved.length || unlinked.length
      ? `INCOMPLETE: ${unresolved.length} unresolved finding(s); ${unlinked.length} incoming source(s) have no linked finding.`
      : state.findings.length
        ? "All recorded findings reviewed. This does not establish stakeholder or legal approval."
        : "Source snapshot only: no findings recorded. This is not a completed instruction review.";
  const lines = (rows: Finding[], format: (f: Finding) => string) =>
    rows.length ? rows.map(format).join("\n") : "None recorded.";
  const sources = state.sources
    .map(
      (s) =>
        `[${s.id}] ${exportInline(s.label)} — ${exportInline(s.author)}\n\n${sourceBlock(s.text)}`,
    )
    .join("\n\n");
  const brief = `# ${title} — execution brief\nRevision ${revision} · reviewer record, not a contract\n${completeness}\nInterpretations and completeness are not verified. Exact quotes establish wording, not reasoning or authority.\n\n## Original agreed baseline\n${state.sources
    .filter((s) => s.kind === "baseline")
    .map((s) => sourceBlock(s.text))
    .join(
      "\n\n",
    )}\n\n## Accepted directions (supersede the baseline only where explicitly stated)\n${lines(
    accepted,
    (f) => {
      const r = latestReview(f)!;
      return `- [ ] ${exportInline(r.direction)}\n  Decision owner: ${exportInline(r.owner)}. Rationale: ${exportInline(r.rationale)}\n  Evidence: ${f.evidence.map((e) => `[${e.sourceId}] “${exportInline(e.quote)}”`).join("; ")}`;
    },
  )}\n\n## Not proceeding\n${lines(rejected, (f) => `- ${exportInline(f.title)}: ${exportInline(latestReview(f)!.rationale)}`)}\n\n## Unresolved — do not treat as committed\n${lines(unresolved, (f) => `- ${exportInline(f.title)}: ${exportInline(f.explanation)}`)}\n\n## Source record\n${sources}\n`;
  const acknowledgment = `Draft for human review — not sent\n\nHere is the current record for ${title} (revision ${revision}).\n\nAgreed directions recorded by the reviewer:\n${lines(accepted, (f) => `- ${exportInline(latestReview(f)!.direction)}`)}\n\nRequests not proceeding:\n${lines(rejected, (f) => `- ${exportInline(f.title)}: ${exportInline(latestReview(f)!.rationale)}`)}\n\nQuestions still open:\n${lines(unresolved, (f) => `- ${exportInline(f.title)}`)}\n${unlinked.length ? `Note: ${unlinked.length} incoming source(s) have no linked finding and still need checking.` : "Even a linked source may contain additional requests; completeness is not verified."}\n\nPlease confirm this reflects your understanding. No unreviewed request is a commitment.\n`;
  return { brief, acknowledgment };
}
