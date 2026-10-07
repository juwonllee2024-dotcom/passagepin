import { buildPin, comparePin, normalizeText, verifyIntegrity, type PinDocument } from "./pin.js";

const selectionText = (): string => window.getSelection()?.toString() ?? "";
const status = document.querySelector<HTMLElement>("#status");
const create = document.querySelector<HTMLButtonElement>("#create-pin");
const includeQuote = document.querySelector<HTMLInputElement>("#include-quote");
const file = document.querySelector<HTMLInputElement>("#pin-file");
const verify = document.querySelector<HTMLButtonElement>("#verify-pin");
let loadedPin: PinDocument | undefined;

function reportSelection(): void {
  const normalized = normalizeText(selectionText());
  const summary = document.querySelector<HTMLElement>("#selection-summary");
  if (summary) summary.textContent = normalized ? `Selected: ${normalized.length} characters, ${normalized.split(" ").length} words.` : "Select a sentence above first.";
  if (create) create.disabled = !normalized;
  if (verify) verify.disabled = !normalized || !loadedPin;
}

document.addEventListener("selectionchange", reportSelection);
reportSelection();

create?.addEventListener("click", async () => {
  const selected = selectionText();
  if (!status || !normalizeText(selected)) return;
  create.disabled = true;
  try {
    const pin = await buildPin({ pageUrl: location.href, selectionText: selected, includeQuote: includeQuote?.checked === true, capturedAt: "2026-10-07T01:00:00.000Z" });
    const blob = new Blob([JSON.stringify(pin, null, 2)], { type: "application/json" });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = "passagepin-demo.json";
    anchor.click();
    URL.revokeObjectURL(objectUrl);
    status.textContent = "Pin downloaded. Change the sentence, reselect it, then load the file to verify.";
  } catch {
    status.textContent = "Could not create pin.";
  } finally {
    create.disabled = false;
  }
});

file?.addEventListener("change", async () => {
  loadedPin = undefined;
  if (verify) verify.disabled = true;
  const chosen = file.files?.[0];
  if (!chosen || !status) return;
  try {
    const parsed = JSON.parse(await chosen.text()) as PinDocument;
    const integrity = await verifyIntegrity(parsed);
    if (!integrity.valid) throw new Error(integrity.reason);
    loadedPin = parsed;
    if (verify) verify.disabled = !normalizeText(selectionText());
    status.textContent = "Pin loaded. Select the passage you want to compare, then click Verify.";
  } catch {
    status.textContent = "Invalid or tampered pin file.";
  }
});

verify?.addEventListener("click", async () => {
  if (!loadedPin || !status) return;
  status.textContent = await comparePin(loadedPin, selectionText());
});
