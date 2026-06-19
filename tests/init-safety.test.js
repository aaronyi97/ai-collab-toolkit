import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cliPath = path.join(repoRoot, "bin", "aict.js");

function runAict(args, cwd) {
  return execFileSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: "utf8",
    env: { ...process.env, AICT_TEST: "1" },
  });
}

// Build a project dir with a hand-crafted .aict/install-manifest.json whose
// `files` list is whatever the test passes (to simulate a tampered/stale
// manifest). Returns { base, proj }.
function makeProjectWithManifest(files) {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "aict-safety-"));
  const proj = path.join(base, "proj");
  fs.mkdirSync(path.join(proj, ".aict"), { recursive: true });
  fs.writeFileSync(
    path.join(proj, ".aict", "install-manifest.json"),
    JSON.stringify({ tool: "ai-collab-toolkit", version: "0.1.0", files }, null, 2),
  );
  return { base, proj };
}

describe("init --uninstall — path safety", () => {
  it("refuses a manifest entry that escapes the project with ../ and never deletes outside cwd", () => {
    const { base, proj } = makeProjectWithManifest([
      "../victim.txt",
      ".aict/install-manifest.json",
    ]);
    // A file that lives OUTSIDE the project directory.
    const victim = path.join(base, "victim.txt");
    fs.writeFileSync(victim, "SENTINEL must not be deleted");

    const output = runAict(["init", "--uninstall"], proj);

    // The cwd-external file must still exist.
    assert.equal(fs.existsSync(victim), true, "uninstall must not delete files outside cwd");
    // It must be explicitly reported as refused, with a containment reason.
    assert.match(output, /Refused/);
    assert.match(output, /\.\.\/victim\.txt \(outside project directory\)/);
    // The legitimate managed file is still removed.
    assert.match(output, /- \.aict\/install-manifest\.json/);
  });

  it("refuses an absolute-path manifest entry", () => {
    const { base, proj } = makeProjectWithManifest([]);
    const victim = path.join(base, "abs-victim.txt");
    fs.writeFileSync(victim, "SENTINEL");
    // Rewrite the manifest to list the absolute path directly.
    fs.writeFileSync(
      path.join(proj, ".aict", "install-manifest.json"),
      JSON.stringify({ files: [victim, ".aict/install-manifest.json"] }),
    );

    const output = runAict(["init", "--uninstall"], proj);

    assert.equal(fs.existsSync(victim), true, "uninstall must not delete an absolute path outside cwd");
    assert.match(output, /\(absolute path\)/);
  });

  it("refuses an in-cwd file that aict does not manage", () => {
    const base = fs.mkdtempSync(path.join(os.tmpdir(), "aict-safety-"));
    fs.mkdirSync(path.join(base, ".aict"), { recursive: true });
    const userFile = path.join(base, "IMPORTANT.md");
    fs.writeFileSync(userFile, "user's own file, not created by aict");
    fs.writeFileSync(
      path.join(base, ".aict", "install-manifest.json"),
      JSON.stringify({ files: ["IMPORTANT.md", ".aict/install-manifest.json"] }),
    );

    const output = runAict(["init", "--uninstall"], base);

    assert.equal(fs.existsSync(userFile), true, "uninstall must only delete aict-managed files");
    assert.match(output, /IMPORTANT\.md \(not an aict-managed file\)/);
  });

  it("still removes every real aict-created file on a normal init + uninstall", () => {
    const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "aict-safety-"));
    runAict(["init", "--tool", "all"], workspace);

    const output = runAict(["init", "--uninstall"], workspace);

    // Nothing legitimate should be refused on a clean round-trip.
    assert.equal(output.includes("Refused"), false, "no aict-managed file should be refused");
    // The managed files are gone.
    assert.equal(fs.existsSync(path.join(workspace, "CLAUDE.md")), false);
    assert.equal(fs.existsSync(path.join(workspace, ".aict")), false);
  });
});
