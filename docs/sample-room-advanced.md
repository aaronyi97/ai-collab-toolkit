# Sample Room — Advanced: a multi-role failure→fix loop

This is the advanced companion to the [sample room](./sample-room.md). The base
page shows *one line* (an acceptance standard) changing the result. This page
shows the next dynamic up: a short, complete **failure → rework → release →
harvest** loop, where a separate **guard** role challenges the work before it is
trusted.

Everything here is **synthetic** — invented for the docs, no real person,
product, or transcript. We reuse the base scenario and give the founder a name,
**Mira** (synthetic), so the roles are easy to follow.

> The point of this page is not "look how many roles you can have." It is the
> opposite: watch **which single judgment** sends the work back, and **which
> single judgment** lets it pass. That is the move worth copying.

## The scenario (synthetic, continued)

Mira is the solo founder from the base sample room: a weekend note-taking
prototype, building the five-screen onboarding. She already has the acceptance
line written down:

> **done means:** a new tester finishes all five onboarding screens without help.

Now she wants an onboarding *plan*. Instead of trusting the first answer, she runs
it through one loop.

## Step 1 — First draft (the maker role)

Mira asks her AI for an onboarding plan. It produces a clean-looking one:

```text
Onboarding plan (v1):
1. Welcome screen with product promise
2. Ask for the user's name and goal
3. Show an example note
4. Prompt to create the first note
5. Celebrate completion + tips for power features
6. Email capture for updates
7. Short product tour of the sidebar
8. Settings walkthrough
```

It reads fine. Eight tidy steps. Nothing obviously wrong — which is exactly when
work slips through.

## Step 2 — The guard role challenges it (the judgment that sends it back)

Mira does **not** accept v1. She gives the plan to a **separate guard role** with
one job: *find holes, do not rewrite, do not sign off.* (In practice this is a
second pass — a fresh chat, or a different-family model; see
[cross-family guard](./system-architecture.md#3-cross-family-guard--review-with-a-different-model-family).)

The guard returns one specific finding:

```text
Guard finding (verdict: REWORK):
The acceptance line is "a new tester finishes all five screens unaided."
- Steps 6, 7, 8 (email capture, sidebar tour, settings) are NOT on the path to
  finishing the five onboarding screens. They are post-onboarding extras.
- No step is tied to the acceptance line, so "done" cannot be checked against it.
Reason for REWORK: the plan optimizes for a complete-looking product tour, not for
the one thing acceptance asks — a tester completing five screens unaided.
```

**This is the judgment that matters.** The work goes back **not** because the plan
was sloppy, but because of one testable mismatch: *steps exist that the acceptance
line does not ask for, and no step is checkable against it.* That is a concrete,
nameable reason — not "make it better."

## Step 3 — Rework, then the judgment that lets it pass

Mira sends it back. The maker role revises against the finding:

```text
Onboarding plan (v2 — cut to the acceptance path):
1. Welcome screen → goes to screen 2          [acceptance: screen 1 of 5 reached]
2. Ask name + goal → goes to screen 3         [acceptance: screen 2 of 5 reached]
3. Show an example note → goes to screen 4    [acceptance: screen 3 of 5 reached]
4. Create the first note → goes to screen 5   [acceptance: screen 4 of 5 reached]
5. Confirmation: "you're set up" (no tips wall)[acceptance: screen 5 of 5, unaided]
Dropped for now: email capture, sidebar tour, settings — revisit AFTER a tester
finishes all five unaided.
```

The guard checks v2 against the same acceptance line:

```text
Guard re-check (verdict: PASS):
- Every step is on the five-screen path. Nothing off-path remains.
- Each step is tied to the acceptance line and is checkable.
Reason for PASS: the plan now maps 1:1 to "a tester finishes five screens unaided,"
so it can be tested instead of just trusted.
Residual risk (not blocking): a real tester for Sunday is still unbooked.
```

**This is the judgment that releases it.** Not "v2 looks nicer" — it passes because
every step now maps to the acceptance line and can be tested. The release is *for a
stated reason*, the same way the rework was.

## Step 4 — Harvest the one reusable rule

The loop is worth keeping only if something compounds out of it. Mira harvests one
rule — the lesson, rewritten public-safe:

```text
Harvest (reusable rule):
"Before accepting any AI plan, cut every step that the acceptance line does not
ask for, and tie each remaining step to it."
Next use: paste it as a guard prompt the next time AI returns a plan.
```

That one line is the asset. Next build, the guard role starts from it instead of
re-deriving it.

## What actually changed

```text
Without the loop:  v1's eight tidy steps go straight into the build. Three of them
                   are off the acceptance path; "done" drifts; the tester gap is
                   never surfaced.
With the loop:     one guard finding (off-path steps, nothing checkable) sends v1
                   back; v2 passes for a stated reason (every step maps to
                   acceptance); one reusable rule is harvested.
```

The model did not get smarter between v1 and v2. A **separation of roles** plus a
**checkable acceptance line** is what turned "looks fine" into "checkable against
the acceptance line, and here is why it passed review" — a real tester is still the
next step.

## Honest note on how this runs

This loop is **orchestrated by you, by hand.** The Community CLI is `init` /
`doctor basic` / `demo`; it does **not** run a maker and a guard for you, and it
does **not** call a second model automatically. "Maker role" and "guard role" here
mean *two passes you drive yourself* — a fresh chat, or a different-family AI —
using the templates as the script. See the architecture page's
[over-claim note](./system-architecture.md#3-cross-family-guard--review-with-a-different-model-family)
and product contract
[§6](./community-v0.2-product-contract.md#6-what-v02-must-not-claim).

---

# 样板间 · 进阶：多角色挑错 → 返工 → 放行 → 收割

这是[样板间](./sample-room.md)的进阶续篇。基础页展示的是*一句话*（一条验收线）改变结果。
这一页往上走一层：一条短而完整的 **挑错 → 返工 → 放行 → 收割** 链，由一个独立的**守卫**角色
在产出被信任之前先挑战它。

这里所有内容都是**合成的**——为文档编的，没有任何真实的人、产品或聊天记录。我们沿用基础页那个
场景，并给这个创始人起个名字，**Mira**（合成·非真实），好让角色容易跟。

> 这一页的重点不是"你能堆多少个角色"，恰恰相反：看的是**哪一条判断**把活打回去、**哪一条判断**
> 让它放行。值得抄走的是那个动作。

## 场景（合成 · 续）

Mira 就是基础样板间里那个独立开发者：一个周末笔记原型，做五屏新手引导。她已经把验收线
写下来了：

> **做完意味着：** 一个新测试者不用问人，就能走完全部五屏新手引导。

现在她想要一份新手引导*计划*。她不直接信第一版答案，而是让它过一遍这个环。

## 第 1 步 — 第一版草稿（出活的角色）

Mira 让 AI 给一份新手引导计划。它给了一份看着挺干净的：

```text
新手引导计划（v1）：
1. 欢迎屏，讲产品承诺
2. 问用户的名字和目标
3. 展示一条示例笔记
4. 引导创建第一条笔记
5. 庆祝完成 + 高级功能提示
6. 留邮箱收更新
7. 侧边栏的简短产品导览
8. 设置项走查
```

读着没毛病。八步，工工整整。没有明显错的地方——而这恰恰是活儿溜过去的时候。

## 第 2 步 — 守卫角色挑战它（把活打回去的那条判断）

Mira **没有**接受 v1。她把计划交给一个**独立的守卫角色**，只给它一件活：*找漏洞、不改写、
不签字放行。*（实操里这就是第二遍——一个新对话，或者一个不同族的模型；见
[跨族守卫](./system-architecture.md#3-cross-family-guard--review-with-a-different-model-family)。）

守卫返回一条具体发现：

```text
守卫发现（裁决：返工）：
验收线是"一个新测试者不用帮助就能走完五屏"。
- 第 6、7、8 步（留邮箱、侧边栏导览、设置）不在"走完这五屏新手引导"的路径上，
  它们是新手引导之后的附加项。
- 没有一步挂到验收线上，所以"做完"没法拿来对照它检查。
返工理由：这份计划是在为"看起来完整的产品导览"优化，而不是为验收要的那一件事——
测试者不用帮助走完五屏——优化。
```

**这就是关键那条判断。** 活儿被打回去，**不是**因为计划写得糙，而是因为一条可检验的错配：
*存在验收线没有要求的步骤，而且没有一步能拿验收线去检查。* 这是个具体、能点名的理由——
不是"再改好点"。

## 第 3 步 — 返工，然后是让它放行的那条判断

Mira 把它打回去。出活的角色照这条发现改：

```text
新手引导计划（v2 — 砍到验收路径上）：
1. 欢迎屏 → 进第 2 屏              [验收：到达 5 屏中的第 1 屏]
2. 问名字 + 目标 → 进第 3 屏       [验收：到达 5 屏中的第 2 屏]
3. 展示示例笔记 → 进第 4 屏        [验收：到达 5 屏中的第 3 屏]
4. 创建第一条笔记 → 进第 5 屏      [验收：到达 5 屏中的第 4 屏]
5. 确认："你设置好了"（不堆提示墙）[验收：到第 5 屏，全程不用帮助]
先放下的：留邮箱、侧边栏导览、设置——等一个测试者不用帮助走完五屏之后再回头做。
```

守卫拿同一条验收线检查 v2：

```text
守卫复检（裁决：放行）：
- 每一步都在五屏路径上，没有留下任何偏离路径的步骤。
- 每一步都挂到验收线上，可检查。
放行理由：现在这份计划和"测试者不用帮助走完五屏"一一对应，所以它能被测试，而不只是被信任。
剩余风险（不阻塞）：周日来的真实测试者还没约。
```

**这就是放行它的那条判断。** 不是"v2 看着更顺眼"——它放行是因为每一步现在都映射到验收线、
都能测。放行是*有明确理由的*，和返工一样。

## 第 4 步 — 收割那一条可复用规则

这个环只有在能沉淀出点东西时才值得留。Mira 收割一条规则——把这次的教训改写成脱敏可公开的版本：

```text
收割（可复用规则）：
"接受任何 AI 计划之前，先砍掉验收线没有要求的每一步，再把剩下每一步挂到验收线上。"
下次怎么用：下次 AI 再返一份计划时，把它粘成守卫的提示词。
```

那一行就是资产。下次开工，守卫角色从它起步，而不是重新推一遍。

## 到底变了什么

```text
没有这个环：  v1 那八步工工整整地直接进了开发。其中三步偏离验收路径；"做完"开始漂移；
              测试者这个缺口从没被照出来。
有这个环：    一条守卫发现（偏离路径的步骤、没东西可检查）把 v1 打回去；v2 因为明确理由放行
              （每一步都映射到验收）；收割出一条可复用规则。
```

v1 到 v2 之间，模型并没有变聪明。是**角色分工**加上**一条可检查的验收线**，把"看着没毛病"
变成了"能按验收线检查、且放行有明确理由"——真人测试还是下一步。

## 关于它怎么跑的诚实说明

这条链是**你亲手编排**的。社区版 CLI 就是 `init` / `doctor basic` / `demo`；它**不会**替你
跑一个出活角色和一个守卫角色，也**不会**自动调第二个模型。这里说的"出活角色"和"守卫角色"，
指的是*你自己驱动的两遍*——一个新对话，或者一个不同族的 AI——拿模板当脚本。见架构页的
[over-claim 说明](./system-architecture.md#3-cross-family-guard--review-with-a-different-model-family)
和产品契约
[§6](./community-v0.2-product-contract.md#6-what-v02-must-not-claim)。
