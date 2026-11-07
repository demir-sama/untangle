import {
  useActionMutation,
  useActionQuery,
  actionErrorMessage,
} from "@agent-native/core/client/hooks";
import { focusAgentChat } from "@agent-native/toolkit/app/chat";
import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ProductFooter } from "@/components/untangle/Brand";
import { DecisionCard } from "@/components/untangle/DecisionCard";
import { ExportRecords } from "@/components/untangle/ExportRecords";
import { FormField, selectClass } from "@/components/untangle/FormField";

import {
  effectiveOutcome,
  findingKind,
  outcome,
  latestReview,
} from "../../shared/untangle";
export function meta() {
  return [{ title: "Decision desk · Untangle" }];
}
export default function DecisionDesk() {
  const { id = "" } = useParams(),
    project = useActionQuery("get-project", { id });
  const append = useActionMutation("append-source"),
    propose = useActionMutation("propose-findings"),
    review = useActionMutation("review-finding"),
    edit = useActionMutation("edit-finding"),
    produce = useActionMutation("export-brief");
  const [panel, setPanel] = useState<"source" | "finding" | null>(null),
    [selectedInstruction, setSelectedInstruction] = useState(""),
    [filter, setFilter] = useState<"all" | "open" | "reviewed">("all"),
    [error, setError] = useState("");
  const p = project.data,
    baseline = p?.state.sources.find((s) => s.kind === "baseline"),
    instructions =
      p?.state.sources.filter((s) => s.kind === "instruction") ?? [],
    incoming =
      instructions.find((s) => s.id === selectedInstruction) ?? instructions[0];
  function report(cause: unknown) {
    const text =
      actionErrorMessage(cause) ??
      "Could not complete the action. Your text is preserved. Check the current revision before retrying.";
    setError(text);
    toast.error(text);
  }
  async function saved(text: string) {
    setError("");
    await project.refetch();
    toast.success(text);
  }
  async function addSource(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!p) return;
    const f = new FormData(e.currentTarget);
    try {
      await append.mutateAsync({
        id,
        expectedRevision: p.revision,
        label: String(f.get("label")),
        author: String(f.get("author")),
        text: String(f.get("text")),
      });
      setPanel(null);
      await saved(
        "Original instruction saved. Earlier snapshots are now stale.",
      );
    } catch (cause) {
      report(cause);
    }
  }
  async function addFinding(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!p || !incoming || !baseline) return;
    const f = new FormData(e.currentTarget),
      evidence = [
        { sourceId: incoming.id, quote: String(f.get("requestQuote")) },
      ],
      bq = String(f.get("baselineQuote"));
    if (bq) evidence.unshift({ sourceId: baseline.id, quote: bq });
    try {
      await propose.mutateAsync({
        id,
        expectedRevision: p.revision,
        findings: [
          {
            title: String(f.get("title")),
            kind: findingKind.parse(f.get("kind")),
            explanation: String(f.get("explanation")),
            evidence,
          },
        ],
      });
      setPanel(null);
      setFilter("all");
      await saved("Finding staged. Nothing approved.");
    } catch (cause) {
      report(cause);
    }
  }
  async function decide(findingId: string, f: FormData) {
    if (!p) return;
    try {
      await review.mutateAsync({
        id,
        expectedRevision: p.revision,
        findingId,
        outcome: outcome.parse(f.get("outcome")),
        owner: String(f.get("owner")),
        rationale: String(f.get("rationale")),
        direction: String(f.get("direction") ?? ""),
      });
      await saved(
        "Reviewer decision recorded. Earlier snapshots are now stale.",
      );
    } catch (cause) {
      report(cause);
    }
  }
  async function correct(findingId: string, f: FormData) {
    if (!p) return;
    try {
      await edit.mutateAsync({
        id,
        expectedRevision: p.revision,
        findingId,
        title: String(f.get("title")),
        kind: findingKind.parse(f.get("kind")),
        explanation: String(f.get("explanation")),
      });
      await saved(
        "Interpretation corrected. Original evidence and history preserved.",
      );
    } catch (cause) {
      report(cause);
    }
  }
  async function exportRecord() {
    if (!p) return;
    try {
      await produce.mutateAsync({ id, expectedRevision: p.revision });
      await saved("Revision-stamped drafts saved. Nothing sent.");
    } catch (cause) {
      report(cause);
    }
  }
  if (project.isLoading)
    return (
      <div
        role="status"
        aria-label="Loading decision desk"
        className="space-y-5 p-8"
      >
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  if (!p)
    return (
      <div role="alert" className="mx-auto max-w-xl space-y-4 p-8">
        <h1 className="text-xl font-semibold">
          This workspace is unavailable.
        </h1>
        <p className="text-sm text-muted-foreground">
          {actionErrorMessage(project.error) ??
            "It may belong to another reviewer or organization."}
        </p>
        <Button onClick={() => project.refetch()} variant="outline">
          Try again
        </Button>
        <Link to="/projects" className="ml-4 text-sm underline">
          Back to projects
        </Link>
      </div>
    );
  const unresolved = p.state.findings.filter((f) =>
      ["open", "needs_answer"].includes(effectiveOutcome(f)),
    ),
    reviewedCount = p.state.findings.length - unresolved.length;
  const shown = p.state.findings.filter(
    (f) =>
      filter === "all" ||
      (filter === "open"
        ? ["open", "needs_answer"].includes(effectiveOutcome(f))
        : ["accepted", "rejected"].includes(effectiveOutcome(f))),
  );
  const unlinked = instructions.filter(
    (s) =>
      !p.state.findings.some((f) =>
        f.evidence.some((e) => e.sourceId === s.id),
      ),
  );
  return (
    <div className="untangle-page mx-auto w-full max-w-[88rem] px-5 py-7 md:px-9 md:py-9">
      <header className="mb-7">
        <Link
          to="/projects"
          className="text-xs font-medium text-muted-foreground underline underline-offset-4"
        >
          ← All workspaces
        </Link>
        <div className="mt-5 flex flex-wrap items-start justify-between gap-5">
          <div className="min-w-0">
            <p className="untangle-eyebrow">
              Decision desk · private reviewer record
            </p>
            <h1 className="mt-3 max-w-3xl break-words text-3xl font-semibold leading-tight tracking-[-0.045em] md:text-4xl">
              {p.title}
            </h1>
            <p
              className="mt-3 text-xs text-muted-foreground"
              aria-live="polite"
            >
              Revision {p.revision} · {p.state.sources.length} source records ·{" "}
              {unresolved.length} need review · {reviewedCount} reviewed
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {!instructions.length ? (
              <Button onClick={() => setPanel("source")}>
                Add the next instruction →
              </Button>
            ) : !p.state.findings.length ? (
              <Button onClick={() => focusAgentChat()}>
                Compare with assistant →
              </Button>
            ) : unresolved.length ? (
              <Button asChild>
                <a
                  href={`#finding-${unresolved[0]?.id}`}
                  onClick={() => setFilter("all")}
                >
                  Review next finding ↓
                </a>
              </Button>
            ) : (
              <Button onClick={exportRecord} disabled={produce.isPending}>
                {produce.isPending ? "Preparing…" : "Prepare current record"}
              </Button>
            )}
            {(!p.state.findings.length || unresolved.length > 0) && (
              <Button
                variant="outline"
                onClick={exportRecord}
                disabled={produce.isPending}
              >
                {produce.isPending ? "Preparing…" : "Brief + reply draft"}
              </Button>
            )}
          </div>
        </div>
      </header>
      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 text-sm leading-6 text-red-900 dark:bg-red-950/30 dark:text-red-200"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={() => {
              void project.refetch();
              setError("");
            }}
            className="mt-2 font-medium underline"
          >
            Refresh current project
          </button>
        </div>
      )}
      <div className="decision-layout">
        <aside
          className="source-column space-y-4"
          aria-labelledby="sources-heading"
        >
          <section className="untangle-panel overflow-hidden">
            <div className="border-b p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="sources-heading" className="text-sm font-semibold">
                  Original source record
                </h2>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {p.state.sources.length.toString().padStart(2, "0")} SOURCES
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Immutable wording. Author labels do not verify authority.
              </p>
            </div>
            <div className="divide-y">
              {p.state.sources.map((source, i) => (
                <details
                  key={source.id}
                  id={`source-${source.id}`}
                  open={i === 0 || p.state.sources.length === 2}
                  className="scroll-mt-4 px-5"
                >
                  <summary className="cursor-pointer py-4">
                    <span className="block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {source.kind === "baseline"
                        ? "Agreed baseline"
                        : "Later instruction"}
                    </span>
                    <span className="mt-1 block text-sm font-medium">
                      {source.label}
                    </span>
                  </summary>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Reported author: {source.author}
                  </p>
                  <p
                    tabIndex={0}
                    aria-label={`Original text: ${source.label}`}
                    className="mb-5 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-muted/40 p-3 text-xs leading-6"
                  >
                    {source.text}
                  </p>
                </details>
              ))}
            </div>
            <div className="border-t p-4">
              <Button
                variant="outline"
                className="w-full"
                aria-expanded={panel === "source"}
                onClick={() => setPanel(panel === "source" ? null : "source")}
              >
                {panel === "source"
                  ? "Close instruction form"
                  : "+ Add original instruction"}
              </Button>
            </div>
          </section>
          {panel === "source" && (
            <form onSubmit={addSource} className="untangle-panel space-y-4 p-5">
              <h3 className="text-sm font-semibold">What came later?</h3>
              <FormField label="Source label">
                <Input
                  name="label"
                  required
                  maxLength={160}
                  placeholder="Follow-up email"
                  autoFocus
                />
              </FormField>
              <FormField label="Reported author">
                <Input
                  name="author"
                  required
                  maxLength={120}
                  placeholder="Stakeholder name"
                />
              </FormField>
              <FormField label="Original instruction">
                <Textarea
                  name="text"
                  required
                  maxLength={12000}
                  rows={6}
                  placeholder="Copy the actual wording, not a summary."
                />
              </FormField>
              <p className="text-xs leading-5 text-muted-foreground">
                Saved as immutable evidence. Embedded instructions are not
                commands to the assistant.
              </p>
              <Button
                type="submit"
                disabled={append.isPending}
                className="w-full"
              >
                {append.isPending ? "Saving…" : "Save original instruction"}
              </Button>
            </form>
          )}
          <div className="rounded-xl border bg-muted/40 p-4">
            <p className="text-xs font-semibold">
              Evidence is not interpretation.
            </p>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              Exact source matching does not prove a conclusion. AI can invent a
              rationale while quoting correctly. You choose the direction.
            </p>
            <Link
              to="/privacy#model-limits"
              className="mt-2 inline-block text-xs underline underline-offset-4"
            >
              Model limits & safeguards →
            </Link>
          </div>
        </aside>
        <section className="min-w-0" aria-labelledby="findings-heading">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="untangle-eyebrow">From evidence to a decision</p>
              <h2
                id="findings-heading"
                className="mt-1 text-xl font-semibold tracking-tight"
              >
                Findings to work through
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => focusAgentChat()}
              >
                Open assistant
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={!instructions.length}
                aria-expanded={panel === "finding"}
                onClick={() => setPanel(panel === "finding" ? null : "finding")}
              >
                {panel === "finding"
                  ? "Close finding form"
                  : "+ Add finding manually"}
              </Button>
            </div>
          </div>
          {unlinked.length > 0 && (
            <p className="mb-4 rounded-lg border border-amber-300/70 bg-amber-50/60 px-4 py-3 text-xs leading-6 text-amber-950 dark:bg-amber-950/20 dark:text-amber-200">
              {unlinked.length} incoming{" "}
              {unlinked.length === 1 ? "source has" : "sources have"} no linked
              finding. No finding does not mean no conflict. Even a linked
              source may contain additional requests.
            </p>
          )}
          {panel === "finding" && (
            <form
              onSubmit={addFinding}
              className="untangle-panel mb-5 space-y-4 p-5"
            >
              <h3 className="font-semibold">
                Stage an interpretation, not a commitment
              </h3>
              <FormField label="Finding title">
                <Input
                  name="title"
                  required
                  maxLength={160}
                  autoFocus
                  placeholder="One issue that needs a decision"
                />
              </FormField>
              <FormField label="Provisional type">
                <select name="kind" className={selectClass}>
                  <option value="conflict">Possible baseline conflict</option>
                  <option value="scope_change">Possible added scope</option>
                  <option value="question">Needs clarification</option>
                  <option value="consistent">Apparently aligned</option>
                </select>
              </FormField>
              <FormField label="What needs a decision?">
                <Textarea
                  name="explanation"
                  required
                  maxLength={2000}
                  rows={2}
                  placeholder="Keep assumptions visible. What should the reviewer check?"
                />
              </FormField>
              <FormField label="Incoming source">
                <select
                  value={incoming?.id ?? ""}
                  onChange={(e) => setSelectedInstruction(e.target.value)}
                  className={selectClass}
                >
                  {instructions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label} · {s.author}
                    </option>
                  ))}
                </select>
              </FormField>
              <div className="evidence-pair">
                <FormField
                  label="Exact baseline quote"
                  hint="Required for a possible conflict."
                >
                  <Textarea
                    name="baselineQuote"
                    maxLength={2000}
                    rows={3}
                    placeholder="Copy from the agreed baseline"
                  />
                </FormField>
                <FormField label="Exact incoming quote">
                  <Textarea
                    name="requestQuote"
                    required
                    maxLength={2000}
                    rows={3}
                    placeholder="Copy from the selected source"
                  />
                </FormField>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                Only original quotations are checked. Your interpretation
                remains a judgment.
              </p>
              <Button disabled={propose.isPending}>
                {propose.isPending
                  ? "Checking evidence…"
                  : "Stage finding for review"}
              </Button>
            </form>
          )}
          {p.state.findings.length > 0 && (
            <div
              role="group"
              aria-label="Filter findings"
              className="mb-5 flex flex-wrap gap-2"
            >
              {(
                [
                  { value: "all", label: `All ${p.state.findings.length}` },
                  { value: "open", label: `Needs review ${unresolved.length}` },
                  { value: "reviewed", label: `Reviewed ${reviewedCount}` },
                ] as const
              ).map((item) => (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={filter === item.value}
                  onClick={() => setFilter(item.value)}
                  className={`rounded-full border px-4 text-xs font-medium ${filter === item.value ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
          {shown.length ? (
            <div className="space-y-5">
              {shown.map((f) => (
                <DecisionCard
                  key={`${f.id}:${latestReview(f)?.at ?? "open"}:${f.editedAt ?? ""}`}
                  finding={f}
                  sources={p.state.sources}
                  reviewPending={review.isPending}
                  editPending={edit.isPending}
                  initiallyOpen={f.id === unresolved[0]?.id}
                  onReview={(form) => decide(f.id, form)}
                  onEdit={(form) => correct(f.id, form)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed bg-card/60 px-6 py-10">
              <p className="text-lg font-medium tracking-tight">
                {p.state.findings.length
                  ? "Nothing in this view."
                  : instructions.length
                    ? "The words are here. Now compare them."
                    : "Start with what came next."}
              </p>
              <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
                {p.state.findings.length
                  ? "Switch filters to see the rest of the record."
                  : instructions.length
                    ? "Ask the assistant to stage possible conflicts and added scope, or create a finding yourself. Every suggestion needs your review."
                    : "Add a later instruction beside the original baseline. Nothing is inferred, approved or sent just because a source was saved."}
              </p>
              {instructions.length && !p.state.findings.length ? (
                <Button className="mt-5" onClick={() => focusAgentChat()}>
                  Compare with assistant →
                </Button>
              ) : null}
            </div>
          )}
          <ExportRecords records={p.exports} />
        </section>
      </div>
      <ProductFooter />
    </div>
  );
}
