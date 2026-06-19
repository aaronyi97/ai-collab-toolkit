# Self-Check Protocol

You do not have to install anything to try AICT. This page is a **copy-pasteable
prompt** you drop into the assistant you already use — Claude Code, Codex, Cursor,
Windsurf, Copilot, Cline, or any other — together with one stuck workflow excerpt.
It returns a single [breakpoint card](./breakpoint-card.md).

Be clear about what this is: it is a **structured checklist and output shape**, not
an AI diagnosis and not a hidden model. The value is that it pre-classifies the
common ways AI collaboration breaks and forces the answer into one useful card.

> This is a prompt, not a CLI command. There is no `aict self-check`. If you want
> the local structural probe instead, the CLI stays available:
> `aict doctor basic --input "<your situation>"`.

## The prompt (copy everything in the box)

```text
You are running a structural self-check, not an AI diagnosis. You are applying a
fixed checklist to text I paste. You are not judging my model, my ability, or
anything outside the text.

Setup:
1. Before I paste anything, remind me to redact secrets, API keys, tokens,
   customer names, and private file paths. Work only with the redacted text.
2. Inspect ONLY the excerpt I provide. Do not assume facts that are not in it.
   Do not browse, fetch, or call any external service.

Checklist — decide if each structure is EXPLICITLY written in my text (merely
mentioning the topic in passing does not count; an explicit denial counts as
missing):
- profile:    how I decide — working style, decision rules, privacy boundary
- context:    the real task boundary — goal, audience, current state, constraints, non-goals
- acceptance: what counts as done — done means / evidence is / still not done if
- handoff:    how the next session resumes — current state, evidence, blocker, next action
- harvest:    what becomes reusable — reusable idea, public-safe rewrite, next use

Then:
3. Select the FIRST missing structure in that exact order. Report only that one.
4. Output EXACTLY one breakpoint card, nothing before or after it:

Top breakpoint: <the single missing structure>
Evidence: <the exact line(s) from my text that show the gap>
Risk: <what goes wrong if this gap stays open>
Next action: <one concrete paste-back step naming the structure to add and its shape>
Community path: <which AICT template closes it, e.g. templates/workflows/acceptance.md>
Pro acceleration: <what paid help would speed up; state that it is never required to fix this>

Rules:
- One card only. Do not write a long report.
- Next action must be concrete. "Write better prompts" is not acceptable.
  Good shape: "Add an acceptance block with done means / evidence is / still not done if."
- This is checklist-based structure detection, not intelligent diagnosis. If I ask
  what it is, say exactly that.

Here is my redacted excerpt:
<paste one stuck AI workflow or conversation excerpt here>
```

## What you should get back

One card in the shape defined by [docs/breakpoint-card.md](./breakpoint-card.md):
a single top breakpoint, the evidence line from your own text, a risk, a concrete
next action, the Community template that closes it, and an honest Pro-acceleration
note. If the assistant returns a long essay instead of one card, tell it "one card
only" and it will compress.

To see a fully worked version of this card on a synthetic case, read
[docs/sample-room.md](./sample-room.md).

## Honesty boundary

- It inspects only what you paste. It does not read your disk or your other chats.
- It does not guarantee better model output. It points at the first missing
  structure so you can decide what to add.
- It is the same five-check logic as `doctor basic`, written as a prompt so it can
  run inside any assistant. The CLI remains the local, offline version.

---

# 自查协议（中文）

试用 AICT 不需要装任何东西。这一页是一段**可直接复制的提示词**，你把它粘进你已经在用的
助手里——Claude Code、Codex、Cursor、Windsurf、Copilot、Cline 或别的都行——再附上一段卡住的
工作流片段，它会回你一张[断点卡](./breakpoint-card.md)。

把话说清楚：它是一份**结构化清单 + 输出格式**，不是 AI 智能诊断，也不是藏起来的模型。它的
价值在于：把"AI 协作常见的几种断法"提前归好类，并把答案逼成一张有用的卡。

> 这是一段提示词，不是命令。没有 `aict self-check` 这个命令。如果你想要本地的结构探针，CLI
> 一直在：`aict doctor basic --input "<你的情况>"`。

## 提示词（把框里的全部复制走）

```text
你现在在做一次结构自查，不是 AI 诊断。你只是在对我粘贴的文本套用一份固定清单。你不评判我的
模型、我的能力，也不评判文本之外的任何东西。

准备：
1. 在我粘任何东西之前，提醒我先脱敏：密钥、API key、token、客户名字、私有文件路径。只处理
   脱敏后的文本。
2. 只检查我提供的这段片段。不要假设片段里没有的事实。不要联网、抓取或调用任何外部服务。

清单——判断每个结构在我的文本里有没有**明确写出来**（只是顺口提到不算；明确说"没有"算
missing）：
- profile 画像：    我怎么决策——工作风格、决策规则、隐私边界
- context 背景：    真正的任务边界——目标、受众、现状、约束、非目标
- acceptance 验收： 什么算做完——做完意味着 / 证据是 / 以下情况仍未完成
- handoff 交接：    下个对话怎么接上——现状、证据、卡点、下一步
- harvest 收割：    什么变成可复用——可复用的点、脱敏改写、下次怎么用

然后：
3. 按这个固定顺序挑出第一个 missing 的结构。只报这一个。
4. 只输出一张断点卡，前后什么都别加：

Top breakpoint 首要断点：<那一个缺失的结构>
Evidence 证据：<我文本里能看出这个缺口的原句>
Risk 风险：<这个缺口不补会出什么问题>
Next action 下一步：<一个具体、能粘回去就用的动作，点名补哪个结构、补成什么形状>
Community path 社区路径：<哪个 AICT 模板能补，例如 templates/workflows/acceptance.md>
Pro acceleration 进阶加速：<付费能省什么时间；并说明补这个缺口本身从不需要付费>

规则：
- 只给一张卡，不要写长报告。
- 下一步必须具体。"把提示词写好点"不合格。好的形状是："补一段验收：做完意味着 / 证据是 /
  以下情况仍未完成。"
- 这是基于清单的结构识别，不是智能诊断。如果我问它是什么，就照这句话说。

下面是我脱敏后的片段：
<在这里粘一段卡住的 AI 工作流或对话片段>
```

## 你应该拿到什么

一张符合 [docs/breakpoint-card.md](./breakpoint-card.md) 格式的卡：一个首要断点、来自你自己
文本的证据原句、一条风险、一个具体的下一步、能补缺口的社区模板，以及一条诚实的进阶加速说明。
如果助手回了一篇长文而不是一张卡，对它说"只给一张卡"，它会压缩。

想看这张卡在一个合成案例上完整跑出来的样子，读 [docs/sample-room.md](./sample-room.md)。

## 诚实边界

- 它只看你粘进去的内容，不读你的硬盘，也不读你的其他对话。
- 它不保证模型输出更好。它只指出第一个缺失的结构，让你自己决定补什么。
- 它和 `doctor basic` 是同一套五项检查逻辑，写成提示词好让它能在任意助手里跑。CLI 是它的
  本地离线版。
