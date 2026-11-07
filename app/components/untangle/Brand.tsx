import type { SVGProps } from "react";
import { Link } from "react-router";

/** Original knot-to-line mark. No external image/font request. */
export function BrandMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" {...props}>
      <rect width="64" height="64" rx="17" fill="#173e35" />
      <path
        d="M12 40c-4-10 1-21 11-22 13-2 22 13 13 23-7 8-21 4-21-7 0-10 13-15 20-7l8 9c3 3 5 4 11 4"
        fill="none"
        stroke="#d8f3df"
        strokeWidth="4.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m24 24 8 10" fill="none" stroke="#173e35" strokeWidth="8" />
      <path
        d="m24 24 8 10"
        fill="none"
        stroke="#d8f3df"
        strokeWidth="4.6"
        strokeLinecap="round"
      />
      <circle cx="54" cy="40" r="2.3" fill="#e9be7a" />
    </svg>
  );
}
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/projects"
      className="untangle-brand"
      aria-label="Untangle projects"
    >
      <BrandMark className={compact ? "size-8 shrink-0" : "size-11 shrink-0"} />
      <span>
        <span className="block text-xl font-semibold tracking-[-0.045em]">
          untangle
          <span className="text-emerald-700 dark:text-emerald-300">.</span>
        </span>
        {!compact && (
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Evidence first. People decide.
          </span>
        )}
      </span>
    </Link>
  );
}
export function ProductFooter() {
  return (
    <footer className="untangle-footer">
      <span>Clear records, not invisible commitments.</span>
      <nav aria-label="Product information">
        <Link to="/guide">Guide</Link>
        <Link to="/about">About</Link>
        <Link to="/privacy">Privacy & limits</Link>
      </nav>
    </footer>
  );
}
