export type PinResult = "EXACT" | "CHANGED" | "MISSING";

export interface PinDocument {
  schema: "passagepin/v1";
  createdAt: string;
  page: { url: string };
  selection: {
    normalizedLength: number;
    words: number;
    sha256: string;
    quote?: string;
  };
  integrity: { algorithm: "SHA-256"; seal: string };
}

export function normalizeText(value: string): string {
  return value.replace(/\s+/gu, " ").trim();
}

function wordCount(value: string): number {
  return value ? value.split(" ").length : 0;
}

function sanitizeUrl(value: string): string {
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname || "/"}`;
  } catch {
    return "invalid-url";
  }
}

export function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalize(record[key])}`)
    .join(",")}}`;
}

export async function sha256Text(value: string): Promise<string> {
  const cryptoApi = globalThis.crypto;
  if (!cryptoApi?.subtle) throw new Error("Web Crypto SHA-256 is unavailable");
  const digest = await cryptoApi.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function buildPin(input: {
  pageUrl: string;
  selectionText: string;
  includeQuote: boolean;
  capturedAt?: string;
}): Promise<PinDocument> {
  const normalized = normalizeText(input.selectionText);
  if (!normalized) throw new Error("selection_required");
  const payload: Omit<PinDocument, "integrity"> = {
    schema: "passagepin/v1",
    createdAt: input.capturedAt ?? new Date().toISOString(),
    page: { url: sanitizeUrl(input.pageUrl) },
    selection: {
      normalizedLength: normalized.length,
      words: wordCount(normalized),
      sha256: await sha256Text(normalized),
      ...(input.includeQuote ? { quote: normalized } : {})
    }
  };
  return {
    ...payload,
    integrity: { algorithm: "SHA-256", seal: await sha256Text(canonicalize(payload)) }
  };
}

export async function verifyIntegrity(pin: PinDocument): Promise<{ valid: boolean; reason: string }> {
  const { integrity, ...payload } = pin ?? ({} as PinDocument);
  if (!integrity || integrity.algorithm !== "SHA-256" || !integrity.seal) {
    return { valid: false, reason: "missing_integrity" };
  }
  const expected = await sha256Text(canonicalize(payload));
  return expected === integrity.seal
    ? { valid: true, reason: "ok" }
    : { valid: false, reason: "integrity_mismatch" };
}

export async function comparePin(pin: PinDocument, currentText: string): Promise<PinResult> {
  const normalized = normalizeText(currentText);
  if (!normalized) return "MISSING";
  return (await sha256Text(normalized)) === pin.selection.sha256 ? "EXACT" : "CHANGED";
}
