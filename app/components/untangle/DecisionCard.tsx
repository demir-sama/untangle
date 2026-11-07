import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  effectiveOutcome,
  latestReview,
  type Finding,
  type Source,
} from "../../../shared/untangle";
import { FormField, selectClass } from "./FormField";
export const kindLabel = (kind: string) =>
  ({
    conflict: "Possible conflict",
    scope_change: "Possible added scope",
    question: "Needs clarification",
    consistent: "Apparently aligned",
  })[kind] ?? kind;
const outcomeLabel = (value: string) =>
  ({
    open: "Needs review",
    needs_answer: "Awaiting clarification",
    accepted: "Direction recorded",
    rejected: "Not proceeding",
  })[value] ?? value;
const dateLabel = (at: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(at)) + " WAT";
interface Props {
  finding: Finding;
  sources: Source[];
  reviewPending: boolean;
  editPending: boolean;
  initiallyOpen: boolean;
  onReview: (form: FormData) => Promise<void>;
  onEdit: (form: FormData) => Promise<void>;
}
export function DecisionCard({
  finding: f,
  sources,
  reviewPending,
  editPending,
  initiallyOpen,
  onReview,
  onEdit,
}: Props) {
  const status = effectiveOutcome(f),
    last = latestReview(f);
  const canEdit = status === "open" || status === "needs_answer";
  const [selection, setSelection] = useState<string>(status);
  const [reviewOpen, setReviewOpen] = useState(initiallyOpen);
  async function review(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await onReview(new FormData(e.currentTarget));
  }
  async function edit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await onEdit(new FormData(e.currentTarget));
  }
  return (
    <article
      id={`finding-${f.id}`}
      className="untangle-panel scroll-mt-5 overflow-hidden"
    >
      <div className="p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span
            className={`text-xs font-semibold ${f.kind === "conflict" ? "text-orange-800 dark:text-orange-300" : "text-emerald-800 dark:text-emerald-300"}`}
          >
            {kindLabel(f.kind)}
          </span>
          <span className="rounded-full border bg-muted/50 px-2.5 py-1 text-[11px] font-medium">
            {outcomeLabel(status)}
          </span>
        </div>
        <h3 className="mt-3 text-xl font-semibold leading-snug tracking-[-0.025em]">
          {f.title}
        </h3>
        <p className="mt-2 text-[11px] text-muted-foreground">
          {f.proposedBy === "agent" ? "Agent-proposed" : "Manually proposed"}
          {f.editedBy ? " · corrected by reviewer" : ""} · no external approval
          implied
        </p>
        <div className="mt-5 rounded-lg border border-dashed bg-muted/30 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Interpretation · not verified
          </p>
          <p className="mt-1.5 text-sm leading-6">{f.explanation}</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Source matching verifies words, not this conclusion. Check the
            passages before deciding.
          </p>
        </div>
        <div className="evidence-pair mt-4">
          {f.evidence.map((e, i) => {
            const source = sources.find((s) => s.id === e.sourceId);
            return (
              <figure
                key={`${e.sourceId}-${i}`}
                className={`min-w-0 rounded-lg border p-4 ${source?.kind === "baseline" ? "bg-slate-50/70 dark:bg-slate-900/30" : "bg-emerald-50/50 dark:bg-emerald-950/20"}`}
              >
                <figcaption className="mb-3">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {source?.kind === "baseline"
                      ? "Agreed baseline"
                      : "Later instruction"}
                  </span>
                  <a
                    href={`#source-${e.sourceId}`}
                    className="mt-1 inline-block text-xs font-medium underline decoration-muted-foreground/40 underline-offset-4"
                  >
                    {source?.label ?? "Source record"} ↗
                  </a>
                </figcaption>
                <blockquote className="whitespace-pre-wrap text-sm leading-6">
                  “{e.quote}”
                </blockquote>
                <p className="mt-3 text-[10px] font-medium text-muted-foreground">
                  Exact source passage · interpretation unverified
                </p>
              </figure>
            );
          })}
        </div>
        {canEdit ? (
          <details className="mt-4 border-t pt-1">
            <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
              Correct this interpretation
            </summary>
            <form onSubmit={edit} className="space-y-3 pb-3">
              <FormField label="Finding title">
                <Input
                  name="title"
                  required
                  maxLength={160}
                  defaultValue={f.title}
                />
              </FormField>
              <FormField label="Provisional type">
                <select
                  name="kind"
                  defaultValue={f.kind}
                  className={selectClass}
                >
                  <option value="conflict">Possible conflict</option>
                  <option value="scope_change">Possible added scope</option>
                  <option value="question">Needs clarification</option>
                  <option value="consistent">Apparently aligned</option>
                </select>
              </FormField>
              <FormField
                label="Your interpretation"
                hint="Evidence stays unchanged. Correction is recorded in a new project revision."
              >
                <Textarea
                  name="explanation"
                  required
                  maxLength={2000}
                  rows={3}
                  defaultValue={f.explanation}
                />
              </FormField>
              <Button variant="outline" disabled={editPending}>
                {editPending ? "Saving correction…" : "Save correction"}
              </Button>
            </form>
          </details>
        ) : null}
      </div>
      <details
        open={reviewOpen}
        onToggle={(e) => setReviewOpen(e.currentTarget.open)}
        className="border-t bg-muted/20 px-5 md:px-6"
      >
        <summary className="cursor-pointer py-3 text-sm font-semibold">
          {canEdit ? "Your decision" : "Review or reopen this decision"}
        </summary>
        {last && (
          <div className="mb-4 rounded-lg border bg-card p-3 text-xs leading-5">
            <p className="font-semibold">
              Last recorded: {outcomeLabel(last.outcome)} · {last.owner}
            </p>
            <p className="mt-1">{last.rationale}</p>
            {last.direction && (
              <p className="mt-1 font-medium">{last.direction}</p>
            )}
          </div>
        )}
        <form onSubmit={review} className="space-y-4 pb-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Reviewer outcome">
              <select
                name="outcome"
                value={selection}
                onChange={(e) => setSelection(e.target.value)}
                className={selectClass}
              >
                <option value="open">Keep open / reopen</option>
                <option value="needs_answer">Ask for clarification</option>
                <option value="accepted">Accept a direction</option>
                <option value="rejected">Do not proceed</option>
              </select>
            </FormField>
            <FormField label="Decision owner (label)">
              <Input
                name="owner"
                required
                maxLength={120}
                defaultValue={last?.owner ?? ""}
                placeholder="Who owns the next decision?"
              />
            </FormField>
          </div>
          <FormField label="Your rationale">
            <Textarea
              name="rationale"
              required
              maxLength={2000}
              rows={2}
              placeholder="Why are you recording this outcome?"
            />
          </FormField>
          {selection === "accepted" && (
            <FormField
              label="Exact execution direction"
              hint="Write the actual next instruction. A finding title is not an agreed direction."
            >
              <Textarea
                name="direction"
                required
                maxLength={3000}
                rows={3}
                defaultValue={last?.direction ?? ""}
                placeholder="What should the team now do?"
              />
            </FormField>
          )}
          <Button disabled={reviewPending}>
            {reviewPending
              ? "Recording…"
              : selection === "accepted"
                ? "Record accepted direction"
                : selection === "open" && last
                  ? "Reopen decision"
                  : "Record reviewer decision"}
          </Button>
          <p className="max-w-xl text-xs leading-5 text-muted-foreground">
            This records your review, not approval by the person named in a
            source. Prior decisions remain in history.
          </p>
        </form>
      </details>
      {f.reviews.length > 0 && (
        <details className="border-t px-5 md:px-6">
          <summary className="cursor-pointer text-xs text-muted-foreground">
            Decision history · {f.reviews.length}{" "}
            {f.reviews.length === 1 ? "entry" : "entries"}
          </summary>
          <ol className="space-y-4 pb-5">
            {f.reviews.map((r, i) => (
              <li
                key={`${r.at}-${i}`}
                className="border-l-2 pl-3 text-xs leading-5"
              >
                <p className="font-semibold">
                  {outcomeLabel(r.outcome)} · {r.owner}
                </p>
                <p>{r.rationale}</p>
                {r.direction && <p className="font-medium">{r.direction}</p>}
                <p className="mt-1 text-muted-foreground">
                  Recorded by {r.actor}
                  <br />
                  {dateLabel(r.at)}
                </p>
              </li>
            ))}
          </ol>
        </details>
      )}
    </article>
  );
}
