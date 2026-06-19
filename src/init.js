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

// The complete allowlist of relative paths `aict init` can ever create. uninstall()
// will only delete a manifest entry if it is in this set, so a tampered or stale
// manifest cannot make uninstall remove arbitrary user files. Keep in sync with
// TEMPLATE_WRITES and TOOLS above.
const MANAGED_RELATIVE_PATHS = new Set([
  ...TEMPLATE_WRITES.map(([target]) => target),
  ...Object.values(TOOLS).flatMap((tool) => tool.writes.map(([target]) => target)),
  ".aict/install-manifest.json",
]);

// Resolve a manifest-listed relative path against cwd and confirm it is both
// (a) inside cwd (no `../` escape, no absolute path) and (b) a path aict manages.
// Returns { ok, absolute } or { ok: false, reason }.
function resolveManagedTarget(relative, cwd) {
  if (typeof relative !== "string" || relative.length === 0) {
    return { ok: false, reason: "not a string" };
  }
  if (path.isAbsolute(relative)) {
    return { ok: false, reason: "absolute path" };
  }
  const cwdResolved = path.resolve(cwd);
  const absolute = path.resolve(cwdResolved, relative);
  const rel = path.relative(cwdResolved, absolute);
  const escapes = rel === ".." || rel.startsWith(".." + path.sep) || path.isAbsolute(rel);
  if (escapes) {
    return { ok: false, reason: "outside project directory" };
  }
  // Normalize to forward-slash form to compare against the allowlist keys.
  const normalized = rel.split(path.sep).join("/");
  if (!MANAGED_RELATIVE_PATHS.has(normalized)) {
    return { ok: false, reason: "not an aict-managed file" };
  }
  return { ok: true, absolute };
}

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

// Read --lang directly from argv so init can localize its next-step hint without
// the shared arg parser having to forward it. English is the default.
function readLang(argv = process.argv) {
  const index = argv.indexOf("--lang");
  if (index !== -1) {
    const value = (argv[index + 1] || "").toLowerCase();
    if (value === "zh" || value === "en") return value;
  }
  return "en";
}

// Three concrete next steps a user can actually follow right after init: open a
// stub and fill it, re-run doctor to watch a check flip missing -> present, then
// paste the filled thread as the first message of the next AI chat.
const NEXT_STEPS = {
  en: [
    "Next steps:",
    "1. Open .aict/project-context.md and .aict/acceptance.md and fill the blank fields (goal, audience, done means, ...).",
    "2. Re-run `node bin/aict.js doctor basic --input-file .aict/acceptance.md` and watch a check flip from missing to present.",
    "3. Paste your filled .aict/ files as the first message of your next AI chat, so the new session starts with structure instead of from zero.",
  ],
  zh: [
    "下一步：",
    "1. 打开 .aict/project-context.md 和 .aict/acceptance.md，把空字段填上（目标、受众、做完意味着……）。",
    "2. 再跑一次 `node bin/aict.js doctor basic --input-file .aict/acceptance.md`，看着某一项从 missing 变成 present。",
    "3. 把填好的 .aict/ 文件粘成下一个 AI 对话的第一条消息，新对话就带着结构开场、而不是从零开始。",
  ],
};

// Dry-run shows the SAME three next steps, but a leading note makes the tense
// honest: nothing was written yet, so these are the steps to take *after* a real
// run. Without this, a new user (who often tries --dry-run first) sees the plan
// and then no guidance at all on what to do next.
const DRY_RUN_NEXT_STEP_NOTE = {
  en: "Next steps (preview only — nothing was written yet; after a real `init` run, follow these three steps):",
  zh: "下一步（仅预览——还没写任何文件；真正跑 `init` 写盘后，照下面这 3 步走）：",
};

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
  lines.push("");
  for (const step of (NEXT_STEPS[readLang()] || NEXT_STEPS.en)) {
    lines.push(step);
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
  const lang = readLang();
  lines.push("");
  lines.push(DRY_RUN_NEXT_STEP_NOTE[lang] || DRY_RUN_NEXT_STEP_NOTE.en);
  // Reuse the real next-step body, minus its own "Next steps:" header (the
  // dry-run note above already serves as the header), so the two paths never
  // drift apart.
  for (const step of (NEXT_STEPS[lang] || NEXT_STEPS.en).slice(1)) {
    lines.push(step);
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

  // Safety gate: each manifest entry must resolve inside cwd AND be a path aict
  // manages. Anything else (a `../` escape, an absolute path, or a file aict does
  // not create) is refused so a tampered/stale manifest can never delete arbitrary
  // user files outside the project.
  const allowed = [];
  const refused = [];
  for (const relative of files) {
    const resolved = resolveManagedTarget(relative, cwd);
    if (resolved.ok) allowed.push({ relative, absolute: resolved.absolute });
    else refused.push({ relative, reason: resolved.reason });
  }

  if (flags.dryRun) {
    const lines = ["AICT uninstall", "Dry run: no files were removed.", "Would remove:"];
    for (const { relative } of allowed) lines.push("- " + relative);
    if (refused.length) {
      lines.push("Refused (outside project or not aict-managed):");
      for (const { relative, reason } of refused) lines.push("- " + relative + " (" + reason + ")");
    }
    return lines.join("\n") + "\n";
  }

  const removed = [];
  for (const { relative, absolute } of allowed) {
    if (fs.existsSync(absolute) && fs.statSync(absolute).isFile()) {
      fs.unlinkSync(absolute);
      removed.push(relative);
    }
  }
  removeEmptyDirs(path.join(cwd, ".aict"), cwd);
  const lines = ["AICT uninstall", "Removed generated files:"];
  for (const file of removed) lines.push("- " + file);
  if (refused.length) {
    lines.push("Refused (outside project or not aict-managed):");
    for (const { relative, reason } of refused) lines.push("- " + relative + " (" + reason + ")");
  }
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
