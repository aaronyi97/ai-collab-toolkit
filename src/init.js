import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const TEMPLATE_WRITES = [
  [".aict/profile.schema.json", "templates/profile/profile.schema.json"],
  [".aict/profile.json", "templates/profile/example-profile.json"],
  [".aict/rules/_core-contract.md", "templates/rules/_core-contract.md"],
  [".aict/rules/AGENTS.md", "templates/rules/AGENTS.md"],
  [".aict/rules/CLAUDE.md", "templates/rules/CLAUDE.md"],
  [".aict/rules/cursor-rules.mdc", "templates/rules/cursor-rules.mdc"],
  [".aict/handoff.md", "templates/workflows/handoff.md"],
  [".aict/review.md", "templates/workflows/review.md"],
  [".aict/harvest.md", "templates/workflows/harvest.md"],
  [".aict/hooks/dry-run-hook.js", "templates/hooks/dry-run-hook.js"],
  [".aict/adapters/basic-adapter.md", "templates/adapters/basic-adapter.md"],
  [".aict/adapters/adapter-config.json", "templates/adapters/adapter-config.json"],
  [".aict/PRIVACY.md", "templates/privacy/LOCAL_PRIVACY.md"],
  [".aict/LICENSE-NOTE.md", "templates/contributing/LICENSE-NOTE.md"],
  [".aict/project-context.md", null],
  [".aict/acceptance.md", null],
];

// Per-tool adapter shells. Each maps a bundled template to the path the target
// tool actually loads it from. The single source of truth (_core-contract.md)
// is always written alongside so every shell can point back to one file.
// Keep destination paths in sync with docs/manual-setup.md.
const TOOLS = {
  claude: {
    label: "Claude / Claude Code",
    writes: [
      ["CLAUDE.md", "templates/rules/CLAUDE.md"],
      [".aict/rules/_core-contract.md", "templates/rules/_core-contract.md"],
    ],
  },
  codex: {
    label: "Codex / AGENTS.md agents",
    writes: [
      ["AGENTS.md", "templates/rules/AGENTS.md"],
      [".aict/rules/_core-contract.md", "templates/rules/_core-contract.md"],
    ],
  },
  cursor: {
    label: "Cursor",
    writes: [
      [".cursor/rules/ai-collab.mdc", "templates/rules/cursor-rules.mdc"],
      [".aict/rules/_core-contract.md", "templates/rules/_core-contract.md"],
    ],
  },
  windsurf: {
    label: "Windsurf",
    writes: [
      [".windsurf/rules/ai-collab.md", "templates/rules/windsurf-rules.md"],
      [".aict/rules/_core-contract.md", "templates/rules/_core-contract.md"],
    ],
  },
  copilot: {
    label: "GitHub Copilot",
    writes: [
      [".github/copilot-instructions.md", "templates/rules/copilot-instructions.md"],
      [".aict/rules/_core-contract.md", "templates/rules/_core-contract.md"],
    ],
  },
  cline: {
    label: "Cline",
    writes: [
      [".clinerules", "templates/rules/clinerules"],
      [".aict/rules/_core-contract.md", "templates/rules/_core-contract.md"],
    ],
  },
};

const TOOL_NAMES = Object.keys(TOOLS);

const GENERATED_CONTENT = {
  ".aict/project-context.md": [
    "# Project Context",
    "",
    "Goal:",
    "Audience:",
    "Current state:",
    "Constraints:",
    "Non-goals:",
    "",
  ].join("\n"),
  ".aict/acceptance.md": [
    "# Acceptance Standard",
    "",
    "Done means:",
    "Evidence is:",
    "Still not done if:",
    "",
  ].join("\n"),
};

// Read --tool from process.argv directly so init stays self-contained
// (the shared arg parser does not need to know about every command's flags).
function readToolSelection(argv = process.argv) {
  const index = argv.indexOf("--tool");
  if (index === -1) return { tool: null };
  const value = (argv[index + 1] || "").toLowerCase();
  return { tool: value };
}

// Resolve a --tool value to the list of [target, templatePath] writes.
// Returns { writes, selected } or { error } for an unknown tool.
function resolveToolWrites(tool) {
  if (tool === "all") {
    const seen = new Set();
    const writes = [];
    for (const name of TOOL_NAMES) {
      for (const entry of TOOLS[name].writes) {
        if (seen.has(entry[0])) continue;
        seen.add(entry[0]);
        writes.push(entry);
      }
    }
    return { writes, selected: [...TOOL_NAMES] };
  }
  if (!TOOLS[tool]) {
    return { error: tool };
  }
  return { writes: TOOLS[tool].writes, selected: [tool] };
}

export function runInit(flags, cwd = process.cwd()) {
  if (flags.uninstall) {
    return uninstall(flags, cwd);
  }

  const { tool } = readToolSelection();
  let writes = TEMPLATE_WRITES;
  let selectedTools = null;
  if (tool) {
    const resolved = resolveToolWrites(tool);
    if (resolved.error) {
      return unknownTool(resolved.error);
    }
    writes = resolved.writes;
    selectedTools = resolved.selected;
  }

  const planned = writes.map(([target]) => target);
  if (flags.dryRun) {
    return formatDryRun(planned, flags, selectedTools);
  }

  const created = [];
  const skipped = [];
  for (const [relativeTarget, templatePath] of writes) {
    const target = path.join(cwd, relativeTarget);
    if (fs.existsSync(target)) {
      skipped.push(relativeTarget);
      continue;
    }
    fs.mkdirSync(path.dirname(target), { recursive: true });
    const content = templatePath
      ? fs.readFileSync(path.join(repoRoot, templatePath), "utf8")
      : GENERATED_CONTENT[relativeTarget];
    fs.writeFileSync(target, content, "utf8");
    created.push(relativeTarget);
  }

  const manifestPath = path.join(cwd, ".aict", "install-manifest.json");
  const manifest = {
    tool: "ai-collab-toolkit",
    version: "0.1.0",
    createdAt: new Date().toISOString(),
    files: [...created, ".aict/install-manifest.json"],
  };
  if (selectedTools) manifest.tools = selectedTools;
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

  const lines = [];
  lines.push("AICT init");
  if (selectedTools) lines.push("Tools: " + selectedTools.join(", "));
  lines.push("Created files:");
  for (const file of created) lines.push("- " + file);
  if (skipped.length) {
    lines.push("Skipped existing files:");
    for (const file of skipped) lines.push("- " + file);
  }
  lines.push("Manifest: .aict/install-manifest.json");
  if (flags.noNetwork) lines.push("Network: disabled");
  else lines.push("Network: not used");
  if (flags.explain) {
    lines.push(explainLine(selectedTools));
  }
  return lines.join("\n") + "\n";
}

function formatDryRun(planned, flags, selectedTools) {
  const lines = [];
  lines.push("AICT init");
  if (selectedTools) lines.push("Tools: " + selectedTools.join(", "));
  lines.push("Dry run: no files were written.");
  lines.push("Planned writes:");
  for (const file of planned) lines.push("- " + file);
  lines.push("- .aict/install-manifest.json");
  if (flags.noNetwork) lines.push("Network: disabled");
  else lines.push("Network: not used");
  if (flags.explain) {
    lines.push("Explain: these files are generated from bundled templates; no project files outside the listed paths are changed.");
  }
  return lines.join("\n") + "\n";
}

function explainLine(selectedTools) {
  if (selectedTools) {
    return "Explain: --tool writes only the adapter shell(s) for the selected tool plus the shared .aict/rules/_core-contract.md, and does not install hooks into editor configs.";
  }
  return "Explain: init writes only under .aict/ in the current working directory and does not install hooks into editor configs.";
}

function unknownTool(value) {
  const lines = [];
  lines.push("AICT init");
  lines.push("Unknown tool: " + value);
  lines.push("Known tools: " + TOOL_NAMES.join(", ") + ", all");
  lines.push("No files were written.");
  return lines.join("\n") + "\n";
}

function uninstall(flags, cwd) {
  const manifestPath = path.join(cwd, ".aict", "install-manifest.json");
  if (!fs.existsSync(manifestPath)) {
    return "AICT uninstall\nNo .aict/install-manifest.json found. Nothing removed.\n";
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const files = [...new Set(manifest.files || [])].sort((a, b) => b.length - a.length);
  if (flags.dryRun) {
    const lines = ["AICT uninstall", "Dry run: no files were removed.", "Would remove:"];
    for (const file of files) lines.push("- " + file);
    return lines.join("\n") + "\n";
  }

  const removed = [];
  for (const relative of files) {
    const target = path.join(cwd, relative);
    if (fs.existsSync(target) && fs.statSync(target).isFile()) {
      fs.unlinkSync(target);
      removed.push(relative);
    }
  }
  removeEmptyDirs(path.join(cwd, ".aict"), cwd);
  const lines = ["AICT uninstall", "Removed generated files:"];
  for (const file of removed) lines.push("- " + file);
  if (flags.noNetwork) lines.push("Network: disabled");
  else lines.push("Network: not used");
  return lines.join("\n") + "\n";
}

function removeEmptyDirs(dir, stopAt) {
  if (!fs.existsSync(dir) || dir === stopAt) return;
  for (const entry of fs.readdirSync(dir)) {
    const child = path.join(dir, entry);
    if (!fs.existsSync(child)) continue;
    if (fs.statSync(child).isDirectory()) removeEmptyDirs(child, stopAt);
    if (!fs.existsSync(dir)) return;
  }
  if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir);
    removeEmptyDirs(path.dirname(dir), stopAt);
  }
}
