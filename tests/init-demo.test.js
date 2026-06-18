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

describe("init and demo", () => {
  it("init --dry-run lists planned writes without creating files", () => {
    const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "aict-test-"));
    const output = runAict(["init", "--dry-run", "--explain"], workspace);

    assert.match(output, /Dry run: no files were written/);
    assert.equal(output.includes(".aict/profile.json"), true);
    assert.equal(fs.existsSync(path.join(workspace, ".aict")), false);
  });

  it("init writes a manifest and --uninstall removes generated files", () => {
    const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "aict-test-"));

    runAict(["init"], workspace);
    assert.equal(fs.existsSync(path.join(workspace, ".aict", "install-manifest.json")), true);

    const uninstallOutput = runAict(["init", "--uninstall"], workspace);
    assert.match(uninstallOutput, /Removed generated files:/);
    assert.equal(fs.existsSync(path.join(workspace, ".aict")), false);
  });

  it("init writes the core contract and a Cursor shell that points back to it", () => {
    const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "aict-test-"));
    runAict(["init"], workspace);

    const corePath = path.join(workspace, ".aict", "rules", "_core-contract.md");
    assert.equal(fs.existsSync(corePath), true);
    assert.match(fs.readFileSync(corePath, "utf8"), /Single source of truth/);

    const cursorShell = fs.readFileSync(
      path.join(workspace, ".aict", "rules", "cursor-rules.mdc"),
      "utf8",
    );
    assert.match(cursorShell, /_core-contract\.md/);
  });

  it("init --tool cursor --dry-run lists the Cursor path and the shared core", () => {
    const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "aict-test-"));
    const output = runAict(["init", "--tool", "cursor", "--dry-run", "--explain"], workspace);

    assert.match(output, /Tools: cursor/);
    assert.match(output, /Dry run: no files were written/);
    assert.equal(output.includes(".cursor/rules/ai-collab.mdc"), true);
    assert.equal(output.includes(".aict/rules/_core-contract.md"), true);
    // Dry run must not touch the general .aict bundle or the filesystem.
    assert.equal(output.includes(".aict/profile.json"), false);
    assert.equal(fs.existsSync(path.join(workspace, ".aict")), false);
    assert.equal(fs.existsSync(path.join(workspace, ".cursor")), false);
  });

  it("init --tool windsurf writes the shell to .windsurf and records it in the manifest", () => {
    const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "aict-test-"));
    runAict(["init", "--tool", "windsurf"], workspace);

    const shellPath = path.join(workspace, ".windsurf", "rules", "ai-collab.md");
    assert.equal(fs.existsSync(shellPath), true);
    assert.match(fs.readFileSync(shellPath, "utf8"), /_core-contract\.md/);
    assert.equal(
      fs.existsSync(path.join(workspace, ".aict", "rules", "_core-contract.md")),
      true,
    );

    const manifest = JSON.parse(
      fs.readFileSync(path.join(workspace, ".aict", "install-manifest.json"), "utf8"),
    );
    assert.deepEqual(manifest.tools, ["windsurf"]);
    assert.equal(manifest.files.includes(".windsurf/rules/ai-collab.md"), true);

    // --uninstall removes the tool shell listed in the manifest.
    runAict(["init", "--uninstall"], workspace);
    assert.equal(fs.existsSync(shellPath), false);
  });

  it("init --tool all plans every tool destination", () => {
    const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "aict-test-"));
    const output = runAict(["init", "--tool", "all", "--dry-run"], workspace);

    for (const fragment of [
      "CLAUDE.md",
      "AGENTS.md",
      ".cursor/rules/ai-collab.mdc",
      ".windsurf/rules/ai-collab.md",
      ".github/copilot-instructions.md",
      ".clinerules",
    ]) {
      assert.equal(output.includes(fragment), true, "missing " + fragment);
    }
  });

  it("init --tool bogus reports an unknown tool and writes nothing", () => {
    const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "aict-test-"));
    const output = runAict(["init", "--tool", "bogus"], workspace);

    assert.match(output, /Unknown tool: bogus/);
    assert.match(output, /Known tools:/);
    assert.equal(fs.existsSync(path.join(workspace, ".aict")), false);
  });

  it("demo prints the harvest and context package examples", () => {
    const output = runAict(["demo"], repoRoot);

    assert.match(output, /Demo 1: Conversation to content seed/);
    assert.match(output, /Demo 2: Messy task to context package/);
    assert.match(output, /No files written/);
  });
});
