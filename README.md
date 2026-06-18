# AI Collaboration Toolkit

A local-first, bilingual CLI that bootstraps a small AI-collaboration workflow and
checks whether your workflow has the **minimum structure** to stay useful across
long projects and across different AI tools (Claude Code, Cursor, Windsurf,
Copilot, Codex, Cline).

> 中文用户请直接看末尾的 [中文说明 / Chinese guide](#中文说明--chinese-guide)。

---

## Before you start / 开始前必读

This is an **early, experimental** toolkit — published as a working skeleton, not a
finished product. Please calibrate your expectations:

- `doctor basic` is a **public heuristic — a structural probe, not an AI diagnosis.**
  It scans your text for explicit structure markers (a labelled `Acceptance:`, a
  `Handoff note:`, etc.). It does not "understand" your work. The rules are fully
  open in [`src/doctor.js`](./src/doctor.js); there are **no hidden weights**.
- It will not fix your workflow for you. It points at the **first place structure is
  missing**, so you can decide what to do next.
- The templates are starting points, not authority. Adapt them to your team.
- No warranty. Issues / PRs may not get a fast response.

If that's the deal you want, read on.

---

## What it does

Most "AI is failing me" problems are not model problems — they are **missing-structure**
problems. Long projects drift, every new chat restarts from zero, and nobody ever
wrote down what "done" means. This toolkit checks five pieces of structure and tells
you the single most important one you're missing:

1. **Personal profile** — does the AI know how *you* decide?
2. **Project context** — is the real boundary written down?
3. **Acceptance standard** — is "done" defined?
4. **Handoff path** — can the next session resume without starting over?
5. **Output harvest path** — does useful work get saved/reused, or vanish into chat?

---

## Before / After

**Without structure** (what usually happens):

```
You:  help me plan the launch
AI:   here's a 12-step launch plan ...
        ... (next day, new chat) ...
You:  continue the launch plan
AI:   what launch plan? let's start fresh ...
→ every session restarts · nothing accumulates · "done" was never defined
```

**With `doctor basic`** (it names the first gap):

```
$ aict doctor basic --input "AI gave a 12-step launch plan, no acceptance, no handoff"

Top breakpoint: Acceptance standard is missing.
Evidence: "... no acceptance ..."
Risk: The work can look complete while nobody defined what counts as done.
Next action: Write three bullets — done means / evidence is / still not done if.
→ now you know the FIRST thing to fix.
```

---

## 30-second try (no install)

```bash
npx ai-collab-toolkit doctor basic --input "we chatted about a launch, no acceptance, no handoff"
```

You'll get the five-part report (breakpoint / evidence / risk / next action / Pro
acceleration) on your own text, fully offline.

---

## Install

Three paths, by comfort level:

```bash
# 1) Zero-install, just try it
npx ai-collab-toolkit doctor basic

# 2) Install the short `aict` command
npm install -g ai-collab-toolkit
aict doctor basic

# 3) No npm? Copy templates by hand — see docs/manual-setup.md
```

Requires Node.js >= 18.

---

## Commands

```bash
aict init [--tool <name>]   # scaffold a local .aict/ collaboration folder
aict doctor basic [...]     # find your top missing structure (the main path)
aict demo [--lang en|zh]    # two illustrative local examples
```

### `aict init`

Creates a local `.aict/` folder with a profile schema, rule templates, and
workflow templates (handoff / review / harvest). Use `--tool` to generate rules
for a specific editor:

```bash
aict init --tool cursor      # → .cursor/rules/ai-collab.mdc
aict init --tool all         # → all six tool adapters
```

Supported tools: `claude` · `cursor` · `windsurf` · `copilot` · `cline` · `codex`.
All adapters point back to one shared contract (`_core-contract.md`) so they never
drift apart. See [docs/manual-setup.md](./docs/manual-setup.md).

### `aict doctor basic`

Reads `--input "text"`, `--input-file path`, piped stdin, or a built-in sample.
Outputs exactly one top breakpoint with evidence, risk, a next action, and one
"Pro could accelerate" note.

### Global flags

- `--dry-run` — preview writes, change nothing on disk
- `--no-network` — force fully offline behavior (also the default)
- `--explain` — print the rule / path reasoning behind a command
- `--lang en|zh` — report language (English default)
- `--uninstall` — remove files created by `aict init` via the manifest

---

## What `doctor basic` checks (rules are public)

A check reads **present** only when the text carries an **explicit structured marker**
— a labelled declaration like `Acceptance:`, `done means ...`, `Handoff note:`, or
the Chinese equivalents (`验收`, `完成标准`, `交接卡`). Merely *mentioning* a topic
in passing ("we talked about the goal", "my working style is fast") is **not**
structure, so it reads **missing** — that's the point: it catches the gap between
"we chatted about it" and "we actually wrote it down". An explicit denial ("no
acceptance", "没有验收") always forces **missing**.

This is a heuristic, on purpose simple and open. Deeper, weighted, multi-breakpoint
diagnosis is a separate (paid) layer; Community shows only the single most visible gap.

---

## Privacy & safety

Local-first by default — **no upload, no telemetry, no network, no whole-disk scan,
no forced hooks, no config overwrites.** `doctor` redacts secret-looking tokens and
local paths from its evidence output. Details: [`privacy-manifest.json`](./privacy-manifest.json),
[docs/privacy.md](./docs/privacy.md), [SECURITY.md](./SECURITY.md).

If you ever pipe real conversation text into `doctor`, treat it like any AI input:
redact secrets first. The toolkit masks obvious ones but is not a DLP system.

---

## Licensing

Code: **Apache-2.0** ([LICENSE](./LICENSE)). Docs / templates / generated starter
text: **CC BY 4.0** ([LICENSE-DOCS](./LICENSE-DOCS)). Contributions: see
[CONTRIBUTING.md](./CONTRIBUTING.md).

---

## 中文说明 / Chinese guide

**这是什么**：一个本地优先、中英双语的命令行小工具。它帮你给 AI 协作搭一个最小骨架，
并检查你的工作流"有没有最起码的结构"——让 AI 在长项目里不跑偏、换个对话不从零开始、
换个 AI 工具也能接着用。

**先说实话**：这是个**早期实验版**，是能跑的骨架、不是成品。`doctor basic` 是一个
**公开的结构启发探针，不是 AI 智能诊断**——它只检查你有没有把关键结构"明确写出来"，
规则全部公开在 `src/doctor.js`，没有任何隐藏权重。它不替你解决问题，只告诉你
**第一个缺失的结构在哪**。

**doctor 查什么**：五件事——① 个人画像（AI 懂不懂你怎么决策）② 项目背景（边界写没写）
③ 验收标准（"做完"定义了没）④ 交接路径（换对话能不能接上）⑤ 收割路径（产出有没有沉淀）。
关键：只有**明确写成声明**（如"验收：…""完成标准…""交接卡：…"）才算 present；只是
聊天里**顺口提到**不算（判 missing）——这正是它的价值：照出"聊过了"和"真写下来了"的差距。

**怎么用（三档·按你的技术程度选）**：
```bash
# 零安装试一下
npx ai-collab-toolkit doctor basic --input "聊了发布计划，但没有验收，也没有交接"
# 装上短命令
npm install -g ai-collab-toolkit
aict doctor basic --lang zh
# 不想装 npm？手动拷模板，见 docs/manual-setup.md
```

**多工具支持**：`aict init --tool <claude|cursor|windsurf|copilot|cline|codex|all>`
能为不同 AI 编程工具生成协作规则，六个工具共用一份核心契约不漂移。

**隐私边界**：默认本地——不上传、不遥测、不联网、不扫全盘、不强装 hook。详见
`privacy-manifest.json` 与 `SECURITY.md`。把真实对话喂给 doctor 前，请先自行脱敏。
