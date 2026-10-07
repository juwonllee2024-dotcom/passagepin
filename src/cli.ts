import { readFile } from "node:fs/promises";
import { comparePin, verifyIntegrity, type PinDocument } from "./pin.js";

const pinPath = process.argv[2];
const currentPath = process.argv[3];

if (!pinPath || !currentPath) {
  process.stderr.write("Usage: npm run verify -- path/to/pin.json path/to/current.txt\n");
  process.exitCode = 2;
} else {
  try {
    const pin = JSON.parse(await readFile(pinPath, "utf8")) as PinDocument;
    const integrity = await verifyIntegrity(pin);
    if (!integrity.valid) {
      process.stdout.write(`INVALID: ${integrity.reason}\n`);
      process.exitCode = 1;
    } else {
      const currentText = await readFile(currentPath, "utf8");
      process.stdout.write(`${await comparePin(pin, currentText)}\n`);
    }
  } catch {
    process.stderr.write("INVALID: unreadable pin or current text\n");
    process.exitCode = 1;
  }
}
