import {
  buildPin,
  canonicalize,
  comparePin,
  normalizeText,
  verifyIntegrity
} from "../src/pin.js";

const input = {
  pageUrl: "https://example.test/policy?session=never-record#top",
  selectionText: "The exact policy sentence.\nKeep this line together.",
  capturedAt: "2026-10-07T01:00:00.000Z"
};

describe("PassagePin core", () => {
  it("normalizes whitespace before hashing and strips URL query data", async () => {
    const pin = await buildPin({ ...input, includeQuote: false });
    expect(pin.page.url).toBe("https://example.test/policy");
    expect(pin.selection.normalizedLength).toBe(normalizeText(input.selectionText).length);
    expect(pin.selection.words).toBe(8);
    expect(JSON.stringify(pin)).not.toContain("The exact policy sentence");
    expect(pin.selection.quote).toBeUndefined();
  });

  it("stores quote text only after explicit opt-in", async () => {
    const pin = await buildPin({ ...input, includeQuote: true });
    expect(pin.selection.quote).toBe("The exact policy sentence. Keep this line together.");
  });

  it("reports exact, changed, and missing selections", async () => {
    const pin = await buildPin({ ...input, includeQuote: false });
    expect(await comparePin(pin, "The exact policy sentence.   Keep this line together.")).toBe("EXACT");
    expect(await comparePin(pin, "The edited policy sentence. Keep this line together.")).toBe("CHANGED");
    expect(await comparePin(pin, "")).toBe("MISSING");
  });

  it("detects tampered pin metadata", async () => {
    const pin = await buildPin({ ...input, includeQuote: false });
    expect(await verifyIntegrity(pin)).toEqual({ valid: true, reason: "ok" });
    const changed = structuredClone(pin);
    changed.selection.words += 1;
    expect(await verifyIntegrity(changed)).toEqual({ valid: false, reason: "integrity_mismatch" });
  });

  it("canonicalizes object keys for stable seals", () => {
    expect(canonicalize({ b: 2, a: { d: 4, c: 3 } })).toBe('{"a":{"c":3,"d":4},"b":2}');
  });
});
