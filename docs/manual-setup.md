# Manual Setup (no npm)

You do not need the CLI to use this collaboration skeleton. Everything is plain
text. Copy the templates into the paths your AI tool expects.

New here? The [walkthrough](./walkthrough.md) takes you from zero to one filled
artifact in about an hour.

The structure is **one core contract + thin tool shells**:

- `templates/rules/_core-contract.md` is the single source of truth.
- Each tool shell is short and points back to the core contract, so the rules do
  not drift across tools.

**Two-line setup for any tool:**

1. Copy `templates/rules/_core-contract.md` into your project (e.g. to
   `.aict/rules/_core-contract.md`).
2. Copy the tool shell below to the path that tool loads, then open it once to
   confirm the link back to `_core-contract.md` resolves.

## Per-tool paths

| Tool | Copy this template | To this path |
|---|---|---|
| Claude / Claude Code | `templates/rules/CLAUDE.md` | `CLAUDE.md` (project root) |
| Codex / AGENTS.md agents | `templates/rules/AGENTS.md` | `AGENTS.md` (project root) |
| Cursor | `templates/rules/cursor-rules.mdc` | `.cursor/rules/ai-collab.mdc` |
| Windsurf | `templates/rules/windsurf-rules.md` | `.windsurf/rules/ai-collab.md` |
| GitHub Copilot | `templates/rules/copilot-instructions.md` | `.github/copilot-instructions.md` |
| Cline | `templates/rules/clinerules` | `.clinerules` |

### Claude / Claude Code
1. Copy `_core-contract.md` into `.aict/rules/`.
2. Copy `templates/rules/CLAUDE.md` to `CLAUDE.md` in the project root.
3. Start Claude in the project; it auto-loads `CLAUDE.md`.

### Codex / AGENTS.md agents
1. Copy `_core-contract.md` into `.aict/rules/`.
2. Copy `templates/rules/AGENTS.md` to `AGENTS.md` in the project root.
3. Run the agent in the project; it reads `AGENTS.md`.

### Cursor
1. Copy `_core-contract.md` into `.aict/rules/`.
2. Copy `templates/rules/cursor-rules.mdc` to `.cursor/rules/ai-collab.mdc`.
3. The `.mdc` frontmatter (`alwaysApply: true`) loads it automatically.

### Windsurf
1. Copy `_core-contract.md` into `.aict/rules/`.
2. Copy `templates/rules/windsurf-rules.md` to `.windsurf/rules/ai-collab.md`.
3. The `trigger: always_on` header keeps it active.

### GitHub Copilot
1. Copy `_core-contract.md` into `.aict/rules/`.
2. Copy `templates/rules/copilot-instructions.md` to
   `.github/copilot-instructions.md`.
3. Copilot picks up repo custom instructions from that path.

### Cline
1. Copy `_core-contract.md` into `.aict/rules/`.
2. Copy `templates/rules/clinerules` to `.clinerules` in the project root.
3. Cline reads `.clinerules` on the next task.

> Paths above match `aict init --tool <name>`. If you prefer the CLI, run that
> instead of copying by hand.

---

# 手动接入（不装 npm · 中文）

不装 CLI 也能用这套协作骨架。全是纯文本，把模板拷到你的 AI 工具认的路径即可。

第一次用？[走一遍](./walkthrough.md)带你大约一小时从零做出一个填好的成果。

结构是 **一个核心契约 + 各工具薄壳**：

- `templates/rules/_core-contract.md` 是唯一真源（规则正文都在这）。
- 每个工具壳很短，只指回核心契约——这样规则不会在不同工具间各自漂移。

**任意工具两步接入：**

1. 把 `templates/rules/_core-contract.md` 拷进你的项目（比如放到
   `.aict/rules/_core-contract.md`）。
2. 按下表把对应工具壳拷到该工具加载的路径，打开一次确认壳里指回
   `_core-contract.md` 的链接是通的。

| 工具 | 拷这个模板 | 拷到这个路径 |
|---|---|---|
| Claude / Claude Code | `templates/rules/CLAUDE.md` | 项目根 `CLAUDE.md` |
| Codex / AGENTS.md 类 | `templates/rules/AGENTS.md` | 项目根 `AGENTS.md` |
| Cursor | `templates/rules/cursor-rules.mdc` | `.cursor/rules/ai-collab.mdc` |
| Windsurf | `templates/rules/windsurf-rules.md` | `.windsurf/rules/ai-collab.md` |
| GitHub Copilot | `templates/rules/copilot-instructions.md` | `.github/copilot-instructions.md` |
| Cline | `templates/rules/clinerules` | `.clinerules` |

每个工具最多 3 步：① 拷核心契约进 `.aict/rules/` ② 把工具壳拷到上表路径
③ 启动该工具，它会自动加载对应壳文件。

> 上表路径与 `aict init --tool <名字>` 完全一致。想省事就用 CLI，不想装就照表手拷。
