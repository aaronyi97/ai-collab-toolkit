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

Planning note for early testers / contributors: the Community v0.2 product
contract lives in [`docs/community-v0.2-product-contract.md`](./docs/community-v0.2-product-contract.md).
It describes the intended next iteration; it is not a shipped feature list.

If that's the deal you want, read on.

### What's shipped vs. what's roadmap

To set expectations before you read further:

**Shipped now — the whole CLI is three commands:**

- `aict init` — scaffold a local `.aict/` folder (and, with `--tool`, per-editor rule files).
- `aict doctor basic` — a public structural probe that names your top missing structure.
- `aict demo` — two local illustrative examples.

**Roadmap / not yet shipped (do not expect these from the CLI today):**

- A paid **deep-diagnosis** layer (multi-breakpoint, scenario patterns, calibration).
- **Role separation**, a **cross-family guard**, a **judgment loop**, **mode switching**, and a
  **harvest flywheel / self-evolving rules**.

That second list is **collaboration *method and structure*, not CLI features** — patterns
*you* run by hand with the AI tools you already use, described in
[docs/system-architecture.md](./docs/system-architecture.md). The CLI does **not** run
multiple agents, call a second model, or self-evolve anything. See the contract's
[§6 "What v0.2 must not claim"](./docs/community-v0.2-product-contract.md#6-what-v02-must-not-claim).

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

## Which tools this works with

This toolkit works by **putting rule files into your project** (`CLAUDE.md`,
`AGENTS.md`, `.cursor/rules`, etc.) that your AI assistant reads. So the test is
simple: **does the tool read project rule files?**

- **✅ Works with** — assistants that read project rule files: Claude Code, Cursor,
  Codex, GitHub Copilot, Windsurf, Cline, and any tool that reads `AGENTS.md`
  (Gemini CLI, Aider, Zed, JetBrains, … — `AGENTS.md` is a cross-tool standard).
- **❌ Not a fit** — autonomous agents with their own memory/learning architecture
  (e.g. Hermes Agent, Devin-style agents). They already solve memory / structure /
  recall with built-in systems and don't read external collaboration rules, so this
  toolkit would just be redundant for them.

**Rule of thumb**: if the tool reads a `CLAUDE.md` / `AGENTS.md` / rules file, it's a
fit. If it has its own closed memory-and-collaboration brain and ignores external
rule files, you don't need this.

---

## How this fits with rule-sync tools

If you already use a mature rule-sync tool, keep it — this is a **complement, not a
replacement**, and they solve different problems:

- **[rulesync](https://github.com/dyoshikawa/rulesync) / [ruler](https://github.com/intellectronica/ruler)** answer *"keep the same rules in sync across all my AI tools"*
  — one canonical source generated/applied into `CLAUDE.md`, `.cursor/rules`,
  `.github/copilot-instructions.md`, and 20+ other targets. They are mature and good
  at distribution.
- **`aict doctor`** answers a different question: *"does my collaboration structure
  even have the pieces it needs?"* — is there a profile, a written context, a defined
  acceptance standard, a handoff path, a harvest path. It checks the **structure**, not
  the file plumbing.

A reasonable combo: use **rulesync / ruler to sync your rule files** across tools, and
use **`aict doctor` to check whether what those files describe is structurally
complete**. (`aict init --tool` does generate a few rule files too, but that is a small
convenience — for serious multi-tool sync, the dedicated tools above do it better.)

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
$ aict doctor basic --input "Project context: weekend prototype for solo founders. Profile: founder prefers direct risk calls. The conversation has no acceptance standard and no handoff note."

AICT doctor basic
Network: not used
Input: --input

Structure checks:
- Personal profile: present
- Project context: present
- Acceptance standard: missing
- Handoff path: missing
- Output harvest path: missing

Top breakpoint: Acceptance standard is missing. [Acceptance standard]
Evidence: The conversation has no acceptance standard and no handoff note.
Risk: The work can look complete while nobody has defined what would count as done.
Next action: Write three bullets beginning with done means, evidence is, and still not done if.
Method: public heuristic — a structural probe, not an AI diagnosis. Rules are open; no hidden weights.
```

**Not sure which gap is yours?** Start from the [pain selector](./docs/pain-selector.md).

**See it filled in:** the same example runs end-to-end — messy input → breakpoint
card → filled six-piece thread → before/after — in
[docs/sample-room.md](./docs/sample-room.md). The card format it speaks is
[docs/breakpoint-card.md](./docs/breakpoint-card.md).

---

## 30-second try (no install)

```bash
npx ai-collab-toolkit doctor basic --input "we chatted about a launch, no acceptance, no handoff"
```

You'll get the four-part report (breakpoint / evidence / risk / next action) on
your own text. The `doctor` command itself makes no network calls at runtime; the
first `npx`/`npm install` does download the package from the npm registry (after
that you can run it offline).

---

## 10-minute path (no install, no npm)

No Node, no `npx`, nothing to install — just read four docs in order and use the
assistant you already have. This stitches the existing pages into one route:

1. **Find your pain (~2 min).** Skim the [pain selector](./docs/pain-selector.md)
   and pick the symptom that sounds like you ("new chats restart from zero",
   "long projects drift", …). It points you at the likely missing structure.
2. **Self-check your own text (~3 min).** Open the [self-check prompt](./docs/self-check.md),
   paste it into your existing AI tool (Claude, ChatGPT, Cursor, …) with a redacted
   excerpt of your situation. It runs the same five-check logic as the CLI and
   returns one breakpoint card — no install.
3. **See it filled in (~3 min).** Read the [sample room](./docs/sample-room.md): one
   synthetic case from messy input → breakpoint → a filled six-piece thread →
   before/after. This shows what "fixed" looks like.
4. **Go one level up (~2 min, optional).** The [advanced sample room](./docs/sample-room-advanced.md)
   walks a failure → rework → release → harvest loop with a separate guard role —
   a *method you run by hand*, not a CLI feature.

**Where this points next:** everything above is free and shipped. The deeper,
calibrated layer (multi-breakpoint diagnosis, tuned review/guard rubrics) is the
**roadmap / paid layer** — see the "What's shipped vs. what's roadmap" section
above and the architecture map in [docs/system-architecture.md](./docs/system-architecture.md).
Want to actually build the skeleton in your own repo? The
[walkthrough](./docs/walkthrough.md) takes you to one reusable artifact in ~60 minutes.

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

Creates a local `.aict/` folder with a profile schema, rule templates, workflow
templates (handoff / review / harvest), and starter stubs for project context and
acceptance. Use `--tool` to generate rules for a specific editor:

```bash
aict init --tool cursor      # → .cursor/rules/ai-collab.mdc
aict init --tool all         # → all six tool adapters
```

Supported tools: `claude` · `cursor` · `windsurf` · `copilot` · `cline` · `codex`.
All adapters point back to one shared contract (`_core-contract.md`) so they never
drift apart. See [docs/manual-setup.md](./docs/manual-setup.md).

### `aict doctor basic`

Reads `--input "text"`, `--input-file path`, piped stdin, or a built-in sample.
Outputs exactly one top breakpoint with evidence, risk, and a next action. The
"top breakpoint" is the **first missing item in a fixed check order** (profile →
context → acceptance → handoff → harvest) — **not a severity ranking**. It is the
first gap to close, not necessarily the most damaging one.

### Global flags

- `--dry-run` — preview writes, change nothing on disk
- `--no-network` — signals offline intent (core commands make no network calls by
  design anyway; this prints a `Network: disabled` label, it is not an enforced sandbox)
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

早期测试者 / 贡献者可以看
[`docs/community-v0.2-product-contract.md`](./docs/community-v0.2-product-contract.md)，
里面写的是 Community v0.2 的产品契约和下一步方向，不代表这些功能已经全部发布。

**已发布 vs. 路线图（未来层）**——先把预期摆清楚：

- **现在已发布的，整个 CLI 就三个命令**：`aict init`（搭本地 `.aict/` 文件夹，加 `--tool`
  还能生成各编辑器的规则文件）、`aict doctor basic`（公开的结构探针，点名你最缺的那个结构）、
  `aict demo`（两个本地示例）。
- **路线图 / 尚未发布（别指望现在的 CLI 有这些）**：付费的**深度诊断**层（多断点、场景模式、
  校准）；**多角色分工**、**跨族守卫**、**判断闭环**、**模式切换**、**收割飞轮 / 规则自进化**。

第二组是**协作的*方法和结构*，不是 CLI 功能**——是*你*拿已经在用的 AI 工具**亲手编排**的做法，
详见 [docs/system-architecture.md](./docs/system-architecture.md)。CLI **不会**替你跑多个 agent、
不会自动调第二个模型、也不会自进化任何东西。见产品契约
[§6"v0.2 不得宣称的内容"](./docs/community-v0.2-product-contract.md#6-what-v02-must-not-claim)。

**doctor 查什么**：五件事——① 个人画像（AI 懂不懂你怎么决策）② 项目背景（边界写没写）
③ 验收标准（"做完"定义了没）④ 交接路径（换对话能不能接上）⑤ 收割路径（产出有没有沉淀）。
关键：只有**明确写成声明**（如"验收：…""完成标准…""交接卡：…"）才算 present；只是
聊天里**顺口提到**不算（判 missing）——这正是它的价值：照出"聊过了"和"真写下来了"的差距。
报给你的"首要断点"是**按固定顺序（①→⑤）数出来的第一个缺失项，不是按严重程度排的**——是该先补的
那个缺口，不一定是危害最大的那个。

**不确定哪个缺口是你的？** 从[痛点选择器](./docs/pain-selector.md)进。

**看一个填好的例子**：同一个例子从乱输入一路跑到断点卡、填好的六件套 thread、before/after，
都在 [docs/sample-room.md](./docs/sample-room.md)；卡片格式见
[docs/breakpoint-card.md](./docs/breakpoint-card.md)。

**10 分钟路径（零安装、不用 npm）**：不用装 Node、不用 `npx`、什么都不用装——按顺序读四篇文档，
用你已经在用的助手就行。这是把现有页面串成一条路：
1. **找到你的痛点（约 2 分钟）**：扫一眼[痛点选择器](./docs/pain-selector.md)，挑出像你的那条症状
   （"新对话从零开始""长项目跑偏"……），它会指向你大概率缺的那个结构。
2. **自查你自己的文字（约 3 分钟）**：打开[自查提示词](./docs/self-check.md)，连同你脱敏后的情况片段，
   粘进你现有的 AI 工具（Claude、ChatGPT、Cursor……）。它跑的是和 CLI 一样的五项检查，返回一张断点卡——
   不用装。
3. **看一个填好的（约 3 分钟）**：读[样板间](./docs/sample-room.md)：一个合成案例，从乱输入 → 断点 →
   填好的六件套 thread → before/after，让你看见"补好了"长什么样。
4. **再上一层（约 2 分钟，选看）**：[进阶样板间](./docs/sample-room-advanced.md)走一条挑错 → 返工 →
   放行 → 收割链，带一个独立守卫角色——这是*你亲手编排的方法*，不是 CLI 功能。

**这条路往哪走**：上面全是免费、已发布的。更深、校准过的那层（多断点诊断、调好的审查 / 守卫 rubric）
是**路线图 / 付费层**——见上面"已发布 vs. 路线图"那节，以及 [docs/system-architecture.md](./docs/system-architecture.md)
的架构地图。想真在自己仓里把骨架搭起来？[走一遍](./docs/walkthrough.md)带你约 60 分钟做出一个可复用成果。

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

**适配哪些工具**：这套体系靠"往项目里放规则文件（CLAUDE.md / AGENTS.md / .cursor/rules 等）
让 AI 工具读取"来工作，所以判断很简单——**这工具读不读项目里的规则文件？**
- ✅ **适配**（读规则文件的助手）：Claude Code、Cursor、Codex、GitHub Copilot、Windsurf、
  Cline，以及任何读 AGENTS.md 的工具（Gemini CLI / Aider / Zed / JetBrains 等，AGENTS.md 是跨工具标准）。
- ❌ **不适配**（自带记忆/学习架构的自主 agent）：如 Hermes Agent、Devin 类。它们用自己的架构
  已经解决了"记忆/结构/沉淀"，不读外部协作规则，这套体系对它们是重复。
- **一句话判断**：工具读 CLAUDE.md / AGENTS.md / 规则文件 → 适配；它有自己封闭的记忆和协作大脑、
  不读外部规则 → 用不上。

**和规则同步工具怎么搭**：如果你已经在用成熟的规则同步工具，留着它——这俩是**互补、不是替代**，
解决的问题不一样：
- **[rulesync](https://github.com/dyoshikawa/rulesync) / [ruler](https://github.com/intellectronica/ruler)** 回答的是*"把同一份规则同步到我所有 AI 工具里"*——
  一份真源，生成 / 应用到 `CLAUDE.md`、`.cursor/rules`、`.github/copilot-instructions.md` 等
  20 多个目标。它们成熟、擅长分发。
- **`aict doctor`** 回答的是另一个问题：*"我的协作结构到底齐不齐？"*——有没有画像、写没写背景、
  定没定验收、有没有交接路径、有没有收割路径。它查的是**结构**，不是文件管道。
- 合理搭配：用 **rulesync / ruler 同步规则文件**，用 **`aict doctor` 体检这些文件描述的协作结构
  齐不齐**。（`aict init --tool` 自己也能生成几个规则文件，但那只是顺手的小便利——正经的多工具
  同步，上面那两个专门工具做得更好。）

**隐私边界**：默认本地——不上传、不遥测、不联网、不扫全盘、不强装 hook。详见
`privacy-manifest.json` 与 `SECURITY.md`。把真实对话喂给 doctor 前，请先自行脱敏。
