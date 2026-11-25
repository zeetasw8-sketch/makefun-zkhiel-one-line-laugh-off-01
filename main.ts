// One-line laugh-off entry: copy line.txt to the scorer's entry file.
// The text itself lives in line.txt; this script only moves it, verbatim.
import * as fs from "node:fs";
import * as path from "node:path";

// Folder holding this script (and line.txt next to it).
const scriptDir = path.dirname(decodeURIComponent(new URL(import.meta.url).pathname));

// A single laugh line must fit the contest limits: 1 to 200 characters.
function checkBounds(s: string): void {
  if (s.length === 0) {
    throw new Error("empty entry: line.txt has no characters at all");
  }
  if (s.length > 200) {
    throw new Error(`entry too long: ${s.length} characters, the ceiling is 200`);
  }
}

// The line must be real text on exactly one line: no blank entry, no breaks.
function checkLayout(s: string): void {
  if (s.trim() === "") {
    throw new Error("blank entry: the line is only spaces");
  }
  if (/[\r\n]/.test(s)) {
    throw new Error("entry must stay on one line: a line break was found");
  }
}

let entry = fs.readFileSync(path.join(scriptDir, "line.txt"), "utf8");

// Drop one trailing line ending so the output has no newline at the end.
entry = entry.replace(/(\r\n|\n|\r)$/, "");

checkBounds(entry);
checkLayout(entry);

const target = process.env.MAKEFUN_OUTPUT_DIR || "/output";
fs.mkdirSync(target, { recursive: true });
fs.writeFileSync(path.join(target, "entry.txt"), entry, "utf8");
