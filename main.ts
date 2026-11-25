import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

function validateLine(text: string): void {
  if (text.length < 1 || text.length > 200) {
    throw new Error(`line.txt must be 1-200 characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("line.txt must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("line.txt must be exactly one line");
  }
}

let line = readFileSync(join(here, "line.txt"), "utf8");

// Strip a single trailing newline, if present, before validating/writing.
if (line.endsWith("\r\n")) {
  line = line.slice(0, -2);
} else if (line.endsWith("\n") || line.endsWith("\r")) {
  line = line.slice(0, -1);
}

validateLine(line);

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), line, "utf8");
