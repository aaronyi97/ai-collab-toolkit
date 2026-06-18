import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const checksumPath = path.join(root, "checksums.txt");
if (!fs.existsSync(checksumPath)) {
  console.error("checksums.txt is missing. Run npm run checksum.");
  process.exit(1);
}
const failures = [];
for (const line of fs.readFileSync(checksumPath, "utf8").trim().split(/\n/)) {
  if (!line.trim()) continue;
  const [expected, relative] = line.split(/\s\s+/);
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) {
    failures.push(relative + " missing");
    continue;
  }
  const actual = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  if (actual !== expected) failures.push(relative + " checksum mismatch");
}
if (failures.length) {
  console.error("Checksum verification failed:");
  for (const failure of failures) console.error("- " + failure);
  process.exit(1);
}
console.log("Checksum verification passed.");
