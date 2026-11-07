import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { safeNavigationPath } from "../actions/navigate";
import { Brand, BrandMark } from "../app/components/untangle/Brand";
import { DecisionCard } from "../app/components/untangle/DecisionCard";
import { ExportRecords } from "../app/components/untangle/ExportRecords";
import Privacy from "../app/routes/privacy";
import type { Finding, Source } from "../shared/untangle";
const source: Source = {
  id: crypto.randomUUID(),
  kind: "instruction",
  label: "Synthetic source",
  author: "Reported author",
  text: "<script>not executable</script>",
};
const finding: Finding = {
  id: crypto.randomUUID(),
  title: "Check this interpretation",
  kind: "question",
  explanation: "<script>not verified</script>",
  evidence: [{ sourceId: source.id, quote: source.text }],
  proposedBy: "agent",
  reviews: [],
};
const card = () =>
  renderToStaticMarkup(
    <DecisionCard
      finding={finding}
      sources={[source]}
      reviewPending={false}
      editPending={false}
      initiallyOpen
      onReview={async () => {}}
      onEdit={async () => {}}
    />,
  );
describe("product presentation contracts (not visual/browser QA)", () => {
  it("has an original vector mark and accessible product home label", () => {
    const mark = renderToStaticMarkup(<BrandMark />);
    expect(mark).toContain('viewBox="0 0 64 64"');
    expect(mark).toContain('aria-hidden="true"');
    const brand = renderToStaticMarkup(
      <MemoryRouter>
        <Brand />
      </MemoryRouter>,
    );
    expect(brand).toContain('aria-label="Untangle projects"');
    expect(brand).toContain('href="/projects"');
  });
  it("labels interpretation unverified beside evidence instead of inventing confidence", () => {
    const html = card();
    expect(html).toContain("Interpretation · not verified");
    expect(html).toContain(
      "Source matching verifies words, not this conclusion",
    );
    expect(html).not.toContain("confidence: 99");
    expect(html).toContain(`href="#source-${source.id}"`);
  });
  it("escapes malicious evidence and interpretation HTML", () => {
    const html = card();
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;not executable&lt;/script&gt;");
    expect(html).toContain("&lt;script&gt;not verified&lt;/script&gt;");
  });
  it("provides named native review/correction fields", () => {
    const html = card();
    for (const name of [
      "title",
      "kind",
      "explanation",
      "outcome",
      "owner",
      "rationale",
    ])
      expect(html).toContain(`name="${name}"`);
    expect(html).toContain("Record reviewer decision");
  });
  it("shows stale status and labels downloads as drafts", () => {
    const html = renderToStaticMarkup(
      <ExportRecords
        records={[
          {
            id: crypto.randomUUID(),
            revision: 2,
            createdAt: new Date().toISOString(),
            brief: "Synthetic",
            acknowledgment: "Not sent",
            stale: true,
          },
        ]}
      />,
    );
    expect(html).toContain("Stale — project changed");
    expect(html).toContain("nothing sent");
    expect(html).toContain(
      "Previously downloaded files cannot update themselves",
    );
  });
  it("rejects external, executable, protocol-relative and arbitrary setting navigation", () => {
    for (const path of [
      "https://example.com",
      "//example.com",
      "javascript:alert(1)",
      "/settings/agent",
      "/projects/../settings",
      "/\\evil",
    ])
      expect(safeNavigationPath(path)).toBe(false);
    for (const path of [
      "/projects",
      `/projects/${source.id}`,
      "/guide",
      "/privacy",
      "/chat/new",
    ])
      expect(safeNavigationPath(path)).toBe(true);
  });
});

describe("hosted privacy contract", () => {
  it("distinguishes server storage and configured-provider transmission from local development", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <Privacy />
      </MemoryRouter>,
    );
    expect(html).toContain("Neon PostgreSQL");
    expect(html).toContain("Vercel");
    expect(html).toContain("selected");
    expect(html).toContain("provider");
    expect(html).not.toContain(
      "This installation is configured to use a local Ollama service",
    );
    expect(html).toContain("Manual review and exports");
  });
});
