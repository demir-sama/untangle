import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";
describe("production deployment contract", () => {
  it("pins the verified Node major and Hobby-compatible native build", () => {
    const pkg = JSON.parse(
      readFileSync(new URL("../package.json", import.meta.url), "utf8"),
    );
    const deployment = JSON.parse(
      readFileSync(new URL("../vercel.json", import.meta.url), "utf8"),
    );
    expect(pkg.engines.node).toBe("24.x");
    expect(deployment.framework).toBeNull();
    expect(deployment.buildCommand).toContain("NITRO_PRESET=vercel");
    expect(deployment.buildCommand).toContain(
      "AGENT_NATIVE_VERCEL_CRON_SCHEDULE='0 9 * * *'",
    );
    expect(deployment.installCommand).toBe("pnpm install --frozen-lockfile");
    expect(deployment.outputDirectory).toBeUndefined();
  });
});
