# Sample Room (one filled example)

Empty templates do not show value. This page runs **one fully synthetic case**
end to end: messy input → `doctor basic` card → the one line that changes the
result → a filled six-piece thread → a before/after.

Everything here is invented for the docs. There is no real person, product,
customer, path, or transcript in it.

## The scenario (synthetic)

A solo founder spends a weekend building a prototype: a lightweight note-taking
app for other solo founders. They want the **onboarding flow** — the first five
screens — working by Sunday. They asked an AI for help across three separate
chats and got three different launch plans, none of them saved.

## Step 1 — The messy input

This is what the founder actually had: a paragraph of situation, no structure
written down.

```text
We spent the weekend bouncing between three chats trying to get an AI to help
ship a small onboarding flow for a weekend prototype. Project context: the
prototype is a lightweight note-taking app for solo founders, and onboarding is
the first five screens. Profile: the founder prefers direct, fast risk calls and
wants scope cut before anything new is added. The AI produced a 12-step launch
plan, then a different plan the next day, then a checklist nobody saved. There is
no acceptance standard, no handoff note, and no harvest path for the reusable
parts.
```

## Step 2 — Run `doctor basic`

```bash
aict doctor basic --input "We spent the weekend bouncing between three chats trying to get an AI to help ship a small onboarding flow for a weekend prototype. Project context: the prototype is a lightweight note-taking app for solo founders, and onboarding is the first five screens. Profile: the founder prefers direct, fast risk calls and wants scope cut before anything new is added. The AI produced a 12-step launch plan, then a different plan the next day, then a checklist nobody saved. There is no acceptance standard, no handoff note, and no harvest path for the reusable parts."
```

Real CLI output (reproducible — run the command above yourself):

```text
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
Evidence: There is no acceptance standard, no handoff note, and no harvest path for the reusable parts.
Risk: The work can look complete while nobody has defined what would count as done.
Next action: Write three bullets beginning with done means, evidence is, and still not done if.
Method: public heuristic — a structural probe, not an AI diagnosis. Rules are open; no hidden weights.
```

Profile and context were written down, so they read **present**. Acceptance,
handoff, and harvest were explicitly denied, so they read **missing**. The probe
selects the first missing one in fixed order: **acceptance**. See the field shape
in [docs/breakpoint-card.md](./breakpoint-card.md).

## Step 3 — The one line that changes the result

> **done means:** a new tester finishes all five onboarding screens without
> asking for help.

This single acceptance line **changed the result because** every later chat now
has a fixed target to check its own output against. The model did not get
smarter. The work became **reviewable** (you can test a plan against this line),
**resumable** (the next session inherits the same target), and **reusable** (the
line becomes a checklist for the next prototype). Without it, "done" drifted
every session.

## Step 4 — The filled six-piece thread

The probe found the acceptance gap. The thread skeleton is what closes it. Below
is each piece filled for this scenario. Copyable versions live in
[templates/examples/thread-room/](../templates/examples/thread-room/).

**profile** — who the assistant is adapting to
```text
Working style: solo founder, ships over polishes, can run a CLI.
Decision rule: cut scope before adding anything; make fast, direct risk calls.
Privacy boundary: no customer data in prompts; redact before pasting.
```

**context** — what is actually in scope
```text
Goal: a working five-screen onboarding a tester can finish unaided by Sunday.
Audience: other solo founders trying the note-taking prototype.
Current state: three chats of launch plans, nothing saved, nothing tested.
Constraints: one weekend, one person, no budget, prototype only.
Non-goals: not the full app, not branding, not a marketing site.
```

**acceptance** — what counts as done
```text
Done means: a new tester finishes all five onboarding screens without help.
Evidence is: a screen recording of one tester completing it, plus the five
  screens committed to the repo.
Still not done if: any screen needs a verbal explanation, or the tester stalls.
```

**review** — how output is challenged before trust
```text
Scope: the AI's 12-step launch plan.
Finding: 12 steps, no owner per step, none tied to the acceptance line.
Fix: cut to the 3 steps that produce the five screens; attach the acceptance
  line to each; drop the rest until onboarding works.
Residual risk: tester access on Sunday is still unconfirmed.
```

**handoff** — how the next session resumes
```text
Current state: screens 1-3 drafted; 4-5 not started.
Evidence: draft screens in the repo; review note above.
Blocker: no confirmed tester for the Sunday run-through.
Next action: build screens 4-5, then book one tester against "done means".
```

**harvest** — what becomes reusable material
```text
Reusable idea: write the acceptance line before asking AI to plan anything.
Public-safe rewrite: "Define done before you prompt" — a one-line prototype rule.
Next use: paste it as the first line of the next weekend build.
```

## Before / After (synthetic, illustrative)

**Before** — next day, new chat, no structure carried over:
```text
You:  continue the launch plan
AI:   what launch plan? here's a fresh 12-step plan ...
→ a third different plan · no way to tell if it's right · "done" still undefined
```

**After** — same new chat, but the thread above is pasted in first:
```text
You:  here is the context + acceptance + handoff. continue toward "done means".
AI:   screens 1-3 exist, 4-5 don't. Of a launch plan, only 3 steps move a tester
      through five screens unaided — here they are. Booking a tester is still
      open; that's the blocker from your handoff.
→ the plan is checked against your acceptance line · the next step is the real gap
```

The difference is not a smarter model. It is that the workflow now carries its
own target, state, and review across sessions.

## Where to go next

- Not sure which gap is yours? Start from the [pain selector](./pain-selector.md).
- Want to try it without installing? Use the [self-check protocol](./self-check.md)
  inside the assistant you already use.
- Ready to build one yourself? Follow the [walkthrough](./walkthrough.md) to one
  reusable artifact in about an hour.
- Want the next dynamic up? See a synthetic multi-role failure→fix→release→harvest
  loop in [sample-room-advanced.md](./sample-room-advanced.md) — orchestrated by
  hand, not run by the CLI.

> **Pro Pack (early, optional).** Going from one breakpoint to a multi-breakpoint,
> calibrated diagnosis is the (not-yet-shipped) paid layer. This whole sample room
> is free. If you'd want the Pro Pack or a human calibration pass, open an issue
> tagged `[pro]` or leave an email there — never required to fix the gap.

---

# 样板间（一个填好的完整示例 · 中文）

空模板看不出价值。这一页把**一个完全合成的案例**从头跑到尾：乱输入 → `doctor basic`
卡片 → 那一句改变结果的话 → 一套填好的六件套 thread → before/after。

这里所有内容都是为文档编的。没有任何真实的人、产品、客户、路径或聊天记录。

## 场景（合成）

一个独立开发者花一个周末做原型：一个给独立开发者用的轻量笔记应用。他想在周日前把
**新手引导流程**——前五屏——做出来。他在三个不同对话里找 AI 帮忙，拿到三份不一样的上线
计划，一份都没存下来。

## 第 1 步 — 乱糟糟的输入

这就是他手上真实的东西：一段情况描述，没有任何结构写下来。

```text
我们周末在三个对话里来回折腾，想让 AI 帮忙做一个周末原型的新手引导流程。项目背景：这个
原型是给独立开发者用的轻量笔记应用，新手引导就是前五屏。个人画像：这个创始人偏好直给的
风险判断，喜欢先砍范围再加东西。AI 先给了一个 12 步的上线计划，第二天又给了另一个，然后
一份没人保存的清单。这轮没有验收，完成标准还没定，也没有交接，可复用的部分也没有沉淀。
```

## 第 2 步 — 跑 `doctor basic`

```bash
aict doctor basic --lang zh --input "我们周末在三个对话里来回折腾，想让 AI 帮忙做一个周末原型的新手引导流程。项目背景：这个原型是给独立开发者用的轻量笔记应用，新手引导就是前五屏。个人画像：这个创始人偏好直给的风险判断，喜欢先砍范围再加东西。AI 先给了一个 12 步的上线计划，第二天又给了另一个，然后一份没人保存的清单。这轮没有验收，完成标准还没定，也没有交接，可复用的部分也没有沉淀。"
```

真实 CLI 输出（可复现——你自己跑上面那条命令就能得到）：

```text
AICT 工作流体检（基础版）
Network 网络：未使用
Input 输入来源：--input

结构检查：
- 个人画像: present
- 项目背景: present
- 验收标准: missing
- 交接路径: missing
- 成果收割路径: missing

Top breakpoint 首要断点：验收标准缺失。 [验收标准]
Evidence 证据：这轮没有验收，完成标准还没定，也没有交接，可复用的部分也没有沉淀。
Risk 风险：活儿看着像完成了，但根本没人定义过什么才算做完。
Next action 下一步：写三条：做完意味着、证据是、以下情况仍未完成。
方法说明：public heuristic（公开启发式）——结构启发探针，非 AI 诊断；规则公开，不藏权重。
```

画像和背景写下来了，所以判 **present**；验收、交接、收割被明确说"没有"，所以判
**missing**。探针按固定顺序挑出第一个 missing：**验收**。字段格式见
[docs/breakpoint-card.md](./breakpoint-card.md)。

## 第 3 步 — 那一句改变结果的话

> **做完意味着：** 一个新测试者不用问人，就能走完全部五屏新手引导。

这一句验收**之所以改变结果**，是因为之后每个对话都有了一个固定靶子，可以拿来对照自己的
产出。模型并没有变聪明。是这份工作变得**可审查**（能拿计划对照这句话）、**可续接**（下一个
对话继承同一个靶子）、**可复用**（这句话成了下个原型的检查项）。没有它，"做完"每个对话都在
漂移。

## 第 4 步 — 填好的六件套 thread

探针找到了验收这个缺口，补缺口靠的是 thread 骨架。下面是这个场景下每一件填好的样子。
可直接拷贝的版本在 [templates/examples/thread-room/](../templates/examples/thread-room/)。

**profile 个人画像** — 助手要贴着谁来调
```text
工作风格：独立开发者，先出活再打磨，能跑 CLI。
决策规则：先砍范围再加东西；风险判断要快、要直给。
隐私边界：提示里不放客户数据；粘贴前先脱敏。
```

**context 项目背景** — 真正在范围内的是什么
```text
目标：周日前做出一套能让测试者独立走完的五屏新手引导。
受众：试用这个笔记原型的其他独立开发者。
现状：三个对话的上线计划，啥都没存，啥都没测。
约束：一个周末、一个人、没预算、只做原型。
非目标：不是完整 App，不是品牌，不是营销站。
```

**acceptance 验收** — 什么算做完
```text
做完意味着：一个新测试者不用帮助就能走完全部五屏新手引导。
证据是：一段测试者走完全程的录屏，加上五屏代码进了仓库。
以下情况仍未完成：任何一屏需要口头解释，或者测试者卡住。
```

**review 审查** — 信任之前怎么挑战产出
```text
范围：AI 给的 12 步上线计划。
发现：12 步，每步没有责任人，没有一步挂到验收那句话上。
修复：砍到能产出这五屏的 3 步；每步挂上验收那句话；其余的先放下，等新手引导能跑再说。
剩余风险：周日有没有测试者来，还没确认。
```

**handoff 交接** — 下一个对话怎么接上
```text
现状：第 1-3 屏画了草稿；4-5 屏还没开始。
证据：仓库里的草稿屏；上面那条审查记录。
卡点：周日走查没有确认的测试者。
下一步：做第 4-5 屏，然后照"做完意味着"约一个测试者。
```

**harvest 收割** — 什么变成可复用素材
```text
可复用的点：让 AI 规划任何东西之前，先写好验收那句话。
脱敏改写："动笔前先定义做完"——一条一句话的原型规则。
下次怎么用：粘成下个周末开工的第一行。
```

## Before / After（合成示例，仅作示意）

**Before** — 第二天，新对话，什么结构都没带过来：
```text
你：  接着做上线计划
AI：  哪个上线计划？这是一份全新的 12 步计划……
→ 第三份不一样的计划 · 没法判断对不对 · "做完"还是没定义
```

**After** — 同一个新对话，但先把上面那套 thread 粘进去：
```text
你：  这是背景 + 验收 + 交接，朝"做完意味着"继续。
AI：  第 1-3 屏在了，4-5 屏没有。一份上线计划里，只有 3 步真的能让测试者独立走完五屏——
      就这几步。约测试者还没定，那是你交接卡里写的卡点。
→ 计划被拿去对照你的验收线 · 下一步正好是真正的缺口
```

差别不在于模型更聪明，而在于这条工作流现在自己带着靶子、状态和审查，跨对话也不丢。

## 接下来去哪

- 不确定哪个缺口是你的？从[痛点选择器](./pain-selector.md)进。
- 想先不装就试试？把[自查协议](./self-check.md)粘进你已经在用的助手里。
- 想自己搭一个？跟着[走一遍](./walkthrough.md)，大约一小时做出一个可复用成果。
- 想再往上看一层？[sample-room-advanced.md](./sample-room-advanced.md) 里有一条合成的多角色
  挑错→返工→放行→收割链——你亲手编排，不是 CLI 替你跑。

> **Pro Pack（早期·可选）**：从一个断点升级到多断点、校准过的诊断，是那个（尚未发布的）付费层。
> 这整间样板间都免费。想要 Pro Pack 或一次人工校准，就开 issue 标 `[pro]` 或留个邮箱——
> 补缺口本身从不需要它。
