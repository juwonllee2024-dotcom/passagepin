import { buildPin, comparePin, normalizeText, verifyIntegrity, type PinDocument } from "./pin.js";

const HOST_ID = "passagepin-panel-host";

function currentSelection(): string {
  return window.getSelection()?.toString() ?? "";
}

function downloadJson(filename: string, value: object): void {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
}

function addText(parent: HTMLElement, tag: string, text: string): HTMLElement {
  const element = document.createElement(tag);
  element.textContent = text;
  parent.append(element);
  return element;
}

function mount(): void {
  if (document.getElementById(HOST_ID)) return;
  const selectedAtOpen = currentSelection();
  const host = document.createElement("div");
  host.id = HOST_ID;
  const shadow = host.attachShadow({ mode: "closed" });
  const style = document.createElement("style");
  style.textContent = `
    .panel { position: fixed; z-index: 2147483647; top: 16px; right: 16px; width: 340px; padding: 18px; border: 1px solid #334155; border-radius: 16px; background: #0f172a; color: #e2e8f0; box-shadow: 0 18px 50px #0008; font: 14px/1.45 system-ui, sans-serif; }
    h1 { margin: 0 0 6px; font: 700 18px/1.2 system-ui, sans-serif; color: #f8fafc; }
    p { margin: 8px 0; color: #cbd5e1; }
    label { display: block; margin-top: 14px; color: #cbd5e1; }
    input[type=file], button { box-sizing: border-box; width: 100%; margin-top: 7px; padding: 9px 10px; border-radius: 9px; font: inherit; }
    input[type=file] { border: 1px solid #475569; background: #1e293b; color: #e2e8f0; }
    button { border: 0; background: #a3e635; color: #1a2e05; cursor: pointer; font-weight: 700; }
    button.secondary { background: #334155; color: #f8fafc; }
    button:disabled { cursor: not-allowed; opacity: .55; }
    .quiet { font-size: 12px; color: #94a3b8; }
    .status { min-height: 22px; margin-top: 12px; color: #bef264; font-weight: 700; }
    .close { float: right; width: auto; margin: -5px -4px 0 8px; padding: 2px 7px; background: transparent; color: #cbd5e1; }
    .rule { margin: 16px 0; border: 0; border-top: 1px solid #334155; }
  `;
  shadow.append(style);
  const panel = document.createElement("section");
  panel.className = "panel";
  const close = document.createElement("button");
  close.className = "close";
  close.textContent = "×";
  close.setAttribute("aria-label", "Close PassagePin");
  close.addEventListener("click", () => host.remove());
  panel.append(close);
  addText(panel, "h1", "PassagePin");
  addText(panel, "p", "Pin one passage. Verify it later.");
  const normalized = normalizeText(selectedAtOpen);
  const status = addText(panel, "p", normalized ? `Selected locally: ${normalized.length} characters, ${normalized.split(" ").length} words.` : "No passage selected. Close, select text, then invoke PassagePin again.");
  status.className = "status";

  const includeQuote = document.createElement("input");
  includeQuote.type = "checkbox";
  includeQuote.id = "passagepin-include-quote";
  const includeLabel = document.createElement("label");
  includeLabel.htmlFor = includeQuote.id;
  includeLabel.append(includeQuote, document.createTextNode(" Store quote text in file for local citation"));
  panel.append(includeLabel);
  const create = document.createElement("button");
  create.textContent = "Create local pin";
  create.disabled = !normalized;
  panel.append(create);
  create.addEventListener("click", async () => {
    create.disabled = true;
    try {
      const pin = await buildPin({ pageUrl: location.href, selectionText: selectedAtOpen, includeQuote: includeQuote.checked });
      downloadJson(`passagepin-${new Date().toISOString().replace(/[:.]/g, "-")}.json`, pin);
      status.textContent = "Pin downloaded. Nothing was sent or monitored.";
    } catch {
      status.textContent = "Could not create pin.";
    } finally {
      create.disabled = false;
    }
  });

  const rule = document.createElement("hr");
  rule.className = "rule";
  panel.append(rule);
  addText(panel, "p", "Verify a later selection with a local pin file.").className = "quiet";
  const file = document.createElement("input");
  file.type = "file";
  file.accept = "application/json,.json";
  file.setAttribute("aria-label", "Choose PassagePin JSON");
  panel.append(file);
  const verify = document.createElement("button");
  verify.className = "secondary";
  verify.textContent = "Verify selected passage";
  verify.disabled = true;
  panel.append(verify);
  let loadedPin: PinDocument | undefined;
  file.addEventListener("change", async () => {
    loadedPin = undefined;
    verify.disabled = true;
    const chosen = file.files?.[0];
    if (!chosen) return;
    try {
      loadedPin = JSON.parse(await chosen.text()) as PinDocument;
      const integrity = await verifyIntegrity(loadedPin);
      if (!integrity.valid) throw new Error(integrity.reason);
      verify.disabled = !normalized;
      status.textContent = normalized ? "Pin loaded. Verify the selection captured when this panel opened." : "Pin loaded, but current selection is missing.";
    } catch {
      status.textContent = "Invalid or tampered pin file.";
    }
  });
  verify.addEventListener("click", async () => {
    if (!loadedPin) return;
    status.textContent = await comparePin(loadedPin, selectedAtOpen);
  });
  addText(panel, "p", "EXACT means normalized words match. It is not proof of authorship or truth.").className = "quiet";
  shadow.append(panel);
  document.documentElement.append(host);
}

mount();
