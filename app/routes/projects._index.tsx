import {
  useActionMutation,
  useActionQuery,
  actionErrorMessage,
} from "@agent-native/core/client/hooks";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Brand, ProductFooter } from "@/components/untangle/Brand";
import { FormField } from "@/components/untangle/FormField";
export function meta() {
  return [
    { title: "Projects · Untangle" },
    {
      name: "description",
      content:
        "Compare project instructions with the original brief. Keep exact evidence, human decisions and revision-bound records together.",
    },
  ];
}
export default function ProjectsIndex() {
  const projects = useActionQuery("list-projects", {}),
    create = useActionMutation("create-project"),
    navigate = useNavigate();
  const [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError("");
    try {
      const p = await create.mutateAsync({
        title: String(form.get("title")),
        baseline: String(form.get("baseline")),
        label: String(form.get("label")),
        author: String(form.get("author")),
      });
      navigate(`/projects/${p.id}`);
    } catch (cause) {
      const text =
        actionErrorMessage(cause) ??
        "Could not save the baseline. Your text is still here.";
      setError(text);
      toast.error(text);
    }
  }
  return (
    <div className="untangle-page mx-auto w-full max-w-6xl px-5 py-7 md:px-10 md:py-10">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <Brand />
        <Link
          to="/guide"
          className="text-xs font-medium underline underline-offset-4"
        >
          How the decision desk works →
        </Link>
      </div>
      <header className="mb-9 mt-12 max-w-3xl">
        <p className="untangle-eyebrow">Your private decision workspace</p>
        <h1 className="untangle-display mt-4">
          Mixed instructions.
          <br />
          One explicit next step.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
          Bring the agreed brief and later requests together. See the original
          words, decide what changes, and leave a record no one has to guess at.
        </p>
      </header>
      <ol
        aria-label="Review workflow"
        className="mb-9 grid gap-4 rounded-xl border bg-muted/40 p-5 sm:grid-cols-3"
      >
        {[
          {
            n: "01",
            title: "Keep the baseline",
            copy: "Original scope, constraints and exclusions.",
          },
          {
            n: "02",
            title: "Compare the evidence",
            copy: "Exact source passages, not invisible assumptions.",
          },
          {
            n: "03",
            title: "Record your direction",
            copy: "A human decision, then a revision-stamped draft.",
          },
        ].map((step) => (
          <li key={step.n} className="flex gap-3">
            <span className="pt-0.5 font-mono text-[10px] text-muted-foreground">
              {step.n}
            </span>
            <div>
              <p className="text-xs font-semibold">{step.title}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {step.copy}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <div className="grid items-start gap-7 xl:grid-cols-[1.12fr_1fr]">
        <section
          className="untangle-panel p-5 md:p-7"
          aria-labelledby="baseline-heading"
        >
          <p className="untangle-eyebrow">Start a new review</p>
          <h2
            id="baseline-heading"
            className="mt-2 text-xl font-semibold tracking-tight"
          >
            What was originally agreed?
          </h2>
          <p className="mb-6 mt-2 text-xs leading-5 text-muted-foreground">
            Use the actual wording. This becomes an immutable source record, not
            an AI summary.
          </p>
          <form onSubmit={submit} className="space-y-4">
            <FormField label="Project name">
              <Input
                name="title"
                maxLength={120}
                required
                placeholder="Website launch"
                autoComplete="off"
              />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Baseline source">
                <Input
                  name="label"
                  required
                  maxLength={160}
                  placeholder="Agreed brief, version 1"
                />
              </FormField>
              <FormField label="Reported author">
                <Input
                  name="author"
                  required
                  maxLength={120}
                  placeholder="Project sponsor"
                />
              </FormField>
            </div>
            <FormField
              label="Original baseline text"
              hint="Include the scope, constraints and exclusions you need to protect."
            >
              <Textarea
                name="baseline"
                required
                maxLength={12000}
                rows={7}
                placeholder="Paste the agreed scope here. For example: one landing page, blue header, delivery on Friday. Do not paste confidential material."
              />
            </FormField>
            <p className="text-xs leading-5 text-muted-foreground">
              Private reviewer record. Labels do not verify anyone’s approval.{" "}
              <Link to="/privacy" className="underline underline-offset-2">
                Privacy & limits
              </Link>
            </p>
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-300 bg-red-50 p-3 text-xs leading-5 text-red-900 dark:bg-red-950/30 dark:text-red-200"
              >
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={create.isPending}
              className="w-full sm:w-auto"
            >
              {create.isPending
                ? "Saving original baseline…"
                : "Create decision workspace →"}
            </Button>
          </form>
        </section>
        <section aria-labelledby="projects-heading">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2
              id="projects-heading"
              className="text-base font-semibold tracking-tight"
            >
              Your workspaces
            </h2>
            {projects.data && (
              <span className="font-mono text-[11px] text-muted-foreground">
                {projects.data.length} saved
              </span>
            )}
          </div>
          {projects.isLoading ? (
            <div
              role="status"
              aria-label="Loading workspaces"
              className="space-y-3"
            >
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : projects.error ? (
            <div role="alert" className="untangle-panel space-y-3 p-5">
              <p className="text-sm">
                {actionErrorMessage(projects.error) ??
                  "Could not load workspaces."}
              </p>
              <Button variant="outline" onClick={() => projects.refetch()}>
                Try again
              </Button>
            </div>
          ) : projects.data?.length ? (
            <ul className="space-y-3">
              {projects.data.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/projects/${p.id}`}
                    className="untangle-panel group flex min-w-0 items-center justify-between gap-3 p-5 hover:border-emerald-700"
                  >
                    <div className="min-w-0">
                      <strong className="block break-words text-sm font-semibold">
                        {p.title}
                      </strong>
                      <span className="mt-2 block text-xs text-muted-foreground">
                        Revision {p.revision} · private reviewer record
                      </span>
                    </div>
                    <span
                      aria-hidden="true"
                      className="text-muted-foreground group-hover:text-foreground"
                    >
                      ↗
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-dashed p-7">
              <p className="text-sm font-medium">A clear record starts here.</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                No workspaces yet. Save a baseline, add what came later, then
                compare before committing.
              </p>
            </div>
          )}
          <aside className="mt-6 rounded-xl border bg-muted/40 p-5">
            <p className="text-xs font-semibold">
              An assistant, not an approval engine.
            </p>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              AI can suggest findings with source quotes. It can also misread
              them. Every interpretation stays provisional until you review it;
              messages are never sent automatically.
            </p>
            <Link
              to="/privacy#model-limits"
              className="mt-2 inline-block text-xs font-medium underline underline-offset-4"
            >
              Read the actual model limits →
            </Link>
          </aside>
        </section>
      </div>
      <ProductFooter />
    </div>
  );
}
