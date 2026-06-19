import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const forbidden = [
  ".ai" + "-gov",
  "Knowledge" + "OS",
  ".claude" + "/hooks",
  "MOTHER" + "_LAW",
  "OWNER" + "_PROFILE",
  "CONTROL" + "_PROTOCOL",
  "HARVEST" + "_PROTOCOL"
];
const skipDirs = new Set([".git", "node_modules", ".aict"]);
const skipFiles = new Set(["checksums.txt"]);
const hits = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && !skipFiles.has(entry.name)) scanFile(full);
  }
}

function scanFile(file) {
  const buffer = fs.readFileSync(file);
  if (buffer.includes(0)) return;
  const text = buffer.toString("utf8");
  for (const term of forbidden) {
    const index = text.indexOf(term);
    if (index !== -1) hits.push(path.relative(root, file) + " contains " + term);
  }
}

walk(root);
if (hits.length) {
  console.error("Private content scan failed:");
  for (const hit of hits) console.error("- " + hit);
  process.exit(1);
}
console.log("Private content scan passed: no configured private markers found.");
