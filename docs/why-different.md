# Why this is different (and where it isn't)

If you already know the tooling, the fair question is: *there are dozens of AI
tools — what does this one do that they don't, and why would you reach for it?*
Honest answer first: **aict does not compete with most of them. It sits at a
different layer and is often complementary.** Below is where the line actually
falls. No put-downs — these are good tools; the point is the boundary.

aict's layer in one line: it does **not** execute your code, sync your rule
files everywhere, orchestrate agents, or store memory. It checks whether the
**structure around human collaboration** — diagnosis, profile, context,
acceptance + guard, handoff, harvest — is present before you trust the output.
That is a **method layer**, not an execution layer.

| Category | What those tools do | Where aict is different (the boundary) |
|---|---|---|
| **Coding agents** (Aider / Cline / Continue / OpenHands / Goose) | Execute for you: read the repo, write and edit files, run commands, commit. | aict writes no code and runs nothing on your repo. It treats the **collaboration structure** as the thing to get right *before* an agent runs — the pre-execution break points, not the execution. Use a coding agent to *do* the work; use aict to check the work is set up to be trustworthy. |
| **Rule-sync tools** (rulesync / ruler) | Sync one set of rules out to many tools' config files (CLAUDE.md, .cursorrules, Copilot, …). | aict is **complementary, not a replacement**: use rulesync/ruler to *distribute* rules across more tools than aict targets; use `aict doctor` to check whether the collaboration structure those rules describe is actually **complete** (is there an acceptance line, a handoff, a guard pass?). They move rules; aict audits the shape. |
| **Agent-orchestration frameworks** (LangGraph / CrewAI) | Wire multiple agents together and run them automatically — graphs, roles, hand-offs, all executed by the framework. | aict **explicitly does not do this.** The multi-role / cross-family / judgment-loop ideas in these docs are a **method you run by hand** across the AI you already use — not an orchestrator. If you want code that auto-runs N agents, that is what these frameworks are for; aict is not trying to be one. |
| **Memory layers** (mem0) | Give an agent persistent memory — store, recall, and personalize context across sessions. | aict builds **no memory system.** Its "harvest" step is a *human* move — capture one reusable lesson, rewrite it public-safe — not an automatic store/retrieve layer. mem0 remembers for the agent; aict structures the human's judgment, acceptance, and harvest. |

## The links (verified against each project's live repo)

- **Coding agents** — Aider ([Aider-AI/aider](https://github.com/Aider-AI/aider),
  terminal pair-programmer, mature and active), Cline
  ([cline/cline](https://github.com/cline/cline), IDE autonomous agent, active),
  Continue ([continuedev/continue](https://github.com/continuedev/continue) —
  **note: now read-only / archived after being acquired by Cursor**, so reach
  for it as prior art, not a live tool), OpenHands
  ([OpenHands/OpenHands](https://github.com/OpenHands/OpenHands), open coding-agent
  platform, active), Goose ([aaif-goose/goose](https://github.com/aaif-goose/goose),
  extensible agent originally by Block, active — now under the Linux Foundation's AAIF).
- **Rule-sync** — rulesync ([dyoshikawa/rulesync](https://github.com/dyoshikawa/rulesync),
  generates rule files for 20+ tools, active), ruler
  ([intellectronica/ruler](https://github.com/intellectronica/ruler), one rule
  set applied to many agents, active).
- **Orchestration** — LangGraph
  ([langchain-ai/langgraph](https://github.com/langchain-ai/langgraph),
  stateful multi-agent graphs, active), CrewAI
  ([crewAIInc/crewAI](https://github.com/crewAIInc/crewAI), role-based agent
  crews, active).
- **Memory** — mem0 ([mem0ai/mem0](https://github.com/mem0ai/mem0), universal
  memory layer for agents, active).

## The stance, in one line

**aict is not "a better Aider" or "a lighter LangGraph."** It is the layer those
tools don't cover: a **check on the pre-execution collaboration structure** —
bilingual, local-first, and honest about what is method versus what is shipped
software (the CLI is only `init` / `doctor basic` / `demo`; see the
[system architecture](./system-architecture.md) and product contract
[§6](./community-v0.2-product-contract.md#6-what-v02-must-not-claim)). Use the
others to *execute, sync, orchestrate, and remember*; use aict to check the
**human judgment loop** around them is actually there.

---

# 凭什么用它（以及它不抢谁的活 · 中文）

如果你本来就懂这些工具，公道的问题是：*市面上几十个 AI 工具，这个到底做了别人没做的什么，
我凭什么用它？* 先给诚实答案：**aict 跟它们里的大多数并不竞争。它待在不同的层，而且常常是
互补的。** 下面把这条线划清楚。不贬低谁——这些都是好工具，重点是边界在哪。

aict 待的那层，一句话：它**不**替你执行代码、不把规则文件同步到处、不编排 agent、也不存
记忆。它检查的是——在你信任产出之前，**人的协作结构**齐不齐：诊断、画像、上下文、验收 + 守卫、
交接、收割。那是一个**方法层**，不是执行层。

| 类别 | 那些工具做什么 | aict 差在哪（边界） |
|---|---|---|
| **编码 agent**（Aider / Cline / Continue / OpenHands / Goose） | 替你执行：读仓库、写改文件、跑命令、提交。 | aict 不写代码、不在你仓库上跑任何东西。它把**协作结构**当成 agent 跑*之前*该弄对的那件事——执行前的断点，而不是执行本身。用编码 agent 去*干活*；用 aict 检查这活有没有被搭成"可被信任"的样子。 |
| **规则同步工具**（rulesync / ruler） | 把一套规则同步到很多工具的配置文件（CLAUDE.md、.cursorrules、Copilot……）。 | aict 是**互补、不是替代**：用 rulesync/ruler 把规则*分发*到比 aict 覆盖更多的工具；用 `aict doctor` 检查这些规则描述的协作结构是不是真的**齐全**（有没有验收线、有没有交接、有没有守卫这一遍）。它们搬规则；aict 体检结构形状。 |
| **agent 编排框架**（LangGraph / CrewAI） | 把多个 agent 接起来自动跑——图、角色、交接，全由框架执行。 | aict **明确不做这个。** 这些文档里的多角色 / 跨族 / 判断闭环，是一套**你亲手跑**的方法，跨你已经在用的 AI——不是编排器。要"自动跑 N 个 agent"的代码，那是这些框架的活；aict 不想当其中一个。 |
| **记忆层**（mem0） | 给 agent 加持久记忆——跨会话存、取、个性化上下文。 | aict **不建任何记忆系统。** 它的"收割"是一个*人*的动作——抓出一条可复用的教训、改写成脱敏可公开——不是一个自动存/取的层。mem0 替 agent 记住；aict 结构化人的判断、验收和收割。 |

## 链接（都对照各项目的活仓库核过）

- **编码 agent** — Aider（[Aider-AI/aider](https://github.com/Aider-AI/aider)，
  终端结对编程，成熟且活跃）、Cline
  （[cline/cline](https://github.com/cline/cline)，IDE 自主 agent，活跃）、
  Continue（[continuedev/continue](https://github.com/continuedev/continue)——
  **注意：被 Cursor 收购后已转只读 / 归档**，当历史参考看，不是活工具）、OpenHands
  （[OpenHands/OpenHands](https://github.com/OpenHands/OpenHands)，开源编码 agent
  平台，活跃）、Goose（[aaif-goose/goose](https://github.com/aaif-goose/goose)，
  原由 Block 推出的可扩展 agent，活跃——现归 Linux 基金会 AAIF）。
- **规则同步** — rulesync（[dyoshikawa/rulesync](https://github.com/dyoshikawa/rulesync)，
  为 20+ 工具生成规则文件，活跃）、ruler
  （[intellectronica/ruler](https://github.com/intellectronica/ruler)，一套规则
  应用到多个 agent，活跃）。
- **编排** — LangGraph
  （[langchain-ai/langgraph](https://github.com/langchain-ai/langgraph)，
  有状态多 agent 图，活跃）、CrewAI
  （[crewAIInc/crewAI](https://github.com/crewAIInc/crewAI)，基于角色的 agent 团队，
  活跃）。
- **记忆** — mem0（[mem0ai/mem0](https://github.com/mem0ai/mem0)，agent 的通用
  记忆层，活跃）。

## 立场，一句话

**aict 不是"更强的 Aider"，也不是"更轻的 LangGraph"。** 它是那些工具不覆盖的那一层：
对**执行前协作结构的体检**——双语、本地优先、并且对"哪些是方法、哪些是真发布的软件"诚实
（CLI 只有 `init` / `doctor basic` / `demo`；见[系统架构](./system-architecture.md)和产品契约
[§6](./community-v0.2-product-contract.md#6-what-v02-must-not-claim)）。用别人去*执行、同步、
编排、记忆*；用 aict 检查它们周围那个**人的判断闭环**到底在不在。
