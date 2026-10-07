import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("keeps a custom font size next to a token color", () => {
    expect(cn("text-ui text-ink")).toBe("text-ui text-ink");
  });

  it("lets a later font size win", () => {
    expect(cn("text-body text-ink-muted", "text-caption")).toBe("text-ink-muted text-caption");
  });

  it("lets a later color win", () => {
    expect(cn("text-label text-ink", "text-status-eol")).toBe("text-label text-status-eol");
  });
});
