import type { ReactNode } from "react";
import { Link } from "react-router";

import { Brand, ProductFooter } from "./Brand";
export function InfoPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="untangle-page mx-auto w-full max-w-5xl px-5 py-7 md:px-10 md:py-10">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <Brand />
        <Link
          to="/projects"
          className="text-sm font-medium underline underline-offset-4"
        >
          Back to projects →
        </Link>
      </div>
      <header className="mb-10 mt-14 max-w-3xl">
        <p className="untangle-eyebrow">{eyebrow}</p>
        <h1 className="untangle-display mt-4">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
          {intro}
        </p>
      </header>
      <div className="untangle-prose max-w-3xl">{children}</div>
      <ProductFooter />
    </div>
  );
}
