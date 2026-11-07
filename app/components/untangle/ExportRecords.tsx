import type { z } from "zod";

import { Button } from "@/components/ui/button";

import type { exportSchema } from "../../../shared/untangle";
type ExportRecord = z.infer<typeof exportSchema>;
function download(text: string, name: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/markdown;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function ExportRecords({ records }: { records: ExportRecord[] }) {
  return (
    <section aria-labelledby="records-heading" className="mt-8">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h2
          id="records-heading"
          className="text-lg font-semibold tracking-tight"
        >
          Saved snapshots
        </h2>
        <span className="text-xs text-muted-foreground">
          Drafts only · nothing sent
        </span>
      </div>
      {records.length ? (
        <div className="space-y-3">
          {records.map((record) => (
            <details key={record.id} className="untangle-panel px-5">
              <summary className="cursor-pointer py-4 text-sm font-medium">
                Revision {record.revision}
                <span
                  className={`ml-3 text-xs ${record.stale ? "text-orange-800 dark:text-orange-300" : "text-muted-foreground"}`}
                >
                  {record.stale
                    ? "Stale — project changed"
                    : "Current revision · not approval"}
                </span>
              </summary>
              <div className="space-y-4 pb-5">
                {record.stale && (
                  <p className="rounded-lg bg-orange-50 p-3 text-xs leading-5 text-orange-900 dark:bg-orange-950/30 dark:text-orange-200">
                    Do not use this as the current instruction set. Review the
                    latest project, then prepare a fresh snapshot. Previously
                    downloaded files cannot update themselves.
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      download(
                        record.brief,
                        `untangle-r${record.revision}-brief.md`,
                      )
                    }
                  >
                    Download execution brief
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      download(
                        record.acknowledgment,
                        `untangle-r${record.revision}-reply-draft.md`,
                      )
                    }
                  >
                    Download reply draft
                  </Button>
                </div>
                <details>
                  <summary className="cursor-pointer text-xs font-medium">
                    Preview execution brief
                  </summary>
                  <pre
                    tabIndex={0}
                    aria-label={`Execution brief at revision ${record.revision}`}
                    className="mt-2 max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-muted/50 p-4 font-sans text-xs leading-6"
                  >
                    {record.brief}
                  </pre>
                </details>
                <details>
                  <summary className="cursor-pointer text-xs font-medium">
                    Preview acknowledgment draft — not sent
                  </summary>
                  <pre
                    tabIndex={0}
                    aria-label={`Reply draft at revision ${record.revision}`}
                    className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-muted/50 p-4 font-sans text-xs leading-6"
                  >
                    {record.acknowledgment}
                  </pre>
                </details>
              </div>
            </details>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed p-5 text-sm leading-6 text-muted-foreground">
          No snapshots yet. Prepare a brief and reply draft when you need a
          revision-stamped record. Unresolved items will be marked incomplete.
        </p>
      )}
    </section>
  );
}
