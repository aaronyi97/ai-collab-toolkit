import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const skipDirs = new Set([".git", "node_modules", ".aict"]);
const skipFiles = new Set(["checksums.txt"]);
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && !skipFiles.has(entry.name)) files.push(full);
  }
}

walk(root);
files.sort();
const lines = files.map((file) => {
  const hash = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  return hash + "  " + path.relative(root, file);
});
fs.writeFileSync(path.join(root, "checksums.txt"), lines.join("\n") + "\n", "utf8");
console.log("Wrote checksums.txt for " + files.length + " files.");
