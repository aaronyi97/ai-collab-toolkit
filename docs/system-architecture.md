# System Architecture (how the pieces hold together)

Most "AI keeps failing me" problems are not model problems. They are
**structure** problems: long projects drift, every new chat restarts from zero,
nobody wrote down what "done" means, and the good ideas evaporate into chat
history. A better model does not fix any of that. A small amount of the right
structure does.

This page is the map. It shows the **minimum closed loop**, the **six layers**
that make work survive across sessions, and the **five dynamics** that turn that
skeleton from a folder of templates into a working method. Theory is folded away;
the first screen is the shape, not the lecture.

> **What is actually shipped, in one sentence.** The Community CLI has exactly
> three commands — `init` / `doctor basic` / `demo`. Everything else on this page
> — multiple roles, a cross-family guard, a judgment loop, mode switching, a
> harvest flywheel — is a set of **collaboration methods and structure**: rule
> files *you* feed to the Claude / Codex / Cursor you already use, orchestrated
> *by you, by hand*. **This is not a CLI that runs multiple agents for you.** It
> is a way of working that the templates make repeatable. (Aligned with the
> product contract, [§6 "What v0.2 must not claim"](./community-v0.2-product-contract.md#6-what-v02-must-not-claim).)

---

## The minimum closed loop

One task, start to finish, with the structure that keeps it from falling apart:

```text
        ┌──────────────────────────────────────────────────────────┐
        │                                                          │
        ▼                                                          │
   ① DIAGNOSE ──▶ ② PROFILE ──▶ ③ CONTEXT ──▶ ④ ACCEPTANCE+GUARD  │
   where's the     who am I       what's the      what is "done"?   │
   first break?    adapting to?   real boundary?  challenge first   │
                                                        │           │
                                                        ▼           │
                                          ⑤ HANDOFF ──▶ ⑥ HARVEST ──┘
                                          next session   keep the
                                          resumes        reusable part
```

The loop is the point. Diagnosis tells you where to start; the middle four make
one piece of work trustworthy; handoff carries it to the next session; harvest
feeds a reusable rule back to the front. Skip a layer and the loop leaks at that
seam.

---

## The six layers (the skeleton)

Each layer maps to assets already in this repo. One or two sentences each — open
any layer's files to go deeper.

1. **Diagnosis — find the first break.** Enter through the pain you feel, get
   pointed at the single most important missing structure.
   → [pain selector](./pain-selector.md) · `aict doctor basic` ·
   [breakpoint card](./breakpoint-card.md) · [self-check](./self-check.md)

2. **Profile — let the AI know how *you* decide.** A small schema and a filled
   example so the assistant adapts to your working style and risk appetite, not a
   generic persona.
   → [profile schema](../templates/profile/profile.schema.json) ·
   [example profile](../templates/profile/example-profile.json) ·
   [filled profile](../templates/examples/thread-room/profile.md)

3. **Context — write down the real boundary.** Goal, audience, current state,
   constraints, non-goals — so scope stops drifting mid-project.
   → [context template](../templates/workflows/context.md)

4. **Acceptance & Guard — define "done," then challenge it before you trust it.**
   An acceptance line (`done means / evidence is / still not done if`) plus a
   review pass that attacks the output before it's accepted.
   → [acceptance template](../templates/workflows/acceptance.md) ·
   [review template](../templates/workflows/review.md)

5. **Handoff & Thread — so the next session doesn't start from zero.** A handoff
   note (state / evidence / blocker / next action) and a worked thread example
   you can resume from, across tools.
   → [handoff template](../templates/workflows/handoff.md) ·
   [thread-room example](../templates/examples/thread-room/handoff.md)

6. **Harvest — turn one piece of work into a reusable asset.** Capture the one
   idea worth keeping and rewrite it public-safe, so it seeds the next build
   instead of vanishing into chat.
   → [harvest template](../templates/workflows/harvest.md)

**Two cross-cutting principles, under all six layers:**

- **Local-first / no upload.** No telemetry, no network, no whole-disk scan. Your
  work stays on your machine. ([privacy](./privacy.md))
- **One source of truth / many tool adapters.** One shared core contract, thin
  per-tool shells, so the rules don't fork into six inconsistent versions across
  Claude / Codex / Cursor / Windsurf / Copilot / Cline. ([manual setup](./manual-setup.md))

---

## The five dynamics (what makes the skeleton work)

The six layers are the bones. These five dynamics are the design choices that let
the bones move. If you already know AI collaboration, this is the part worth your
attention. Each one is shown as an **evidence block** — four fixed lines:

- **Without it** — what the failure looks like with no such move.
- **The move** — the one thing you do.
- **What changes** — the concrete result.
- **Still not guaranteed** — what this does *not* solve (and what the paid layer
  is actually for).

### 1. Role separation — the one who commands does not review their own work

Split *command / execute / review / harvest* across different roles. The core is
a separation of powers: the role that proposes a plan is not the role that signs
off on it.

```text
Without it:           One AI both writes the plan and grades it, declaring "done"
                      to itself with no independent check.
The move:             Give one independent "guard" role a single job — find holes,
                      never execute, never sign off.
What changes:         It catches what the plan skipped — no owner per step, nothing
                      tied to the acceptance line — and sends it back for rework.
Still not guaranteed: Whether the guard catches the *right* things depends on
                      well-calibrated review criteria (paid layer).
```

> Numbers, illustrative (not a measured stat): with no separation, "done" is
> declared on **pass 1** and 0 of the steps get an independent owner; with a guard
> pass, **3 of 8** steps come back flagged before anything is built.

### 2. Judgment loop — pass / rework / stop, with a three-state acceptance gate

Output is not trusted on sight; it passes through a gate. Three verdicts, plus a
three-state acceptance check — **not done / done-pending-verification / verified**
— where "done-pending-verification" must **show evidence**, not just claim it.

```text
Without it:           The AI says "completed" and that goes straight into your
                      decision.
The move:             Run it through the judgment gate; "done-pending-verification"
                      requires pasted evidence (a diff, the output, a screenshot).
What changes:         A quick check shows it was not actually done → verdict is
                      rework, and it never reached the decision.
Still not guaranteed: The threshold for each verdict still has to be calibrated
                      (paid layer).
```

> Numbers, illustrative (not a measured stat): with no gate, you only notice on
> **round 3** that the output was never really done; with the gate, the unverified
> "completed" is bounced on **round 1**.

### 3. Cross-family guard — review with a *different* model family

When you review a plan, hand it to a different model family (e.g. a plan from
Claude gets reviewed by GPT / Codex). Same-family AIs share the same blind spots,
so one model checking itself misses its own family's systematic gaps.

```text
Without it:           The same model reviews itself and misses the blind spots
                      built into its own family.
The move:             You manually paste the plan into a different vendor's AI for
                      an independent second read.
What changes:         The cross-family read may surface holes the first pass missed.
Still not guaranteed: The guard's criteria and the tiering rules (which findings
                      bind vs. advise) still need calibration (paid layer).
```

```text
Mini-case: input = "a plan that looks complete."
  Same-family self-review:  "Looks good, passes."
  Different-vendor review:   "This assumption your version takes for granted
                              is never actually verified."
  Change: one assumption the family defaulted past gets named.
  Numbers (illustrative, not a stat): same-family 2nd read finds 0 new holes;
                              the 1st cross-family read names 1 unverified assumption.
```

> **⚠️ Read this one carefully — it is the easiest to over-read.** The CLI does
> **not** call two models. There is no auto-orchestration here. This is a
> **method**: *you* take the plan from one AI and hand it to another AI yourself.
> "Cross-family guard" names the **practice of having a different-family model
> review the work** — it is not a feature that runs two models for you.
> Re-stating the whole-page disclosure here on purpose: the Community CLI is
> `init` / `doctor basic` / `demo`; the multi-role, cross-family, judgment-gate,
> mode-switch, and harvest behavior is **collaboration methods and structure you
> orchestrate by hand**, not agents the CLI runs. (Aligned with the product
> contract [§6](./community-v0.2-product-contract.md#6-what-v02-must-not-claim).)

### 4. Mode switching — one AI, different working modes per task

The same AI runs in a declared mode for the task at hand: a strict-execution
mode, an open-thinking mode, a writing mode — each with its own rules and its own
amount of freedom.

```text
Without it:           One prompt style for everything — thinking gets strangled by
                      process, execution gets too loose.
The move:             Declare the mode for the task before you start.
What changes:         Thinking mode opens up challenge and divergence; execution
                      mode tightens process and format.
Still not guaranteed: The tuned prompts that make each mode actually behave well
                      (paid layer).
```

```text
Mini-case: input = the same line, "help me evaluate this plan."
  Execution mode:  produces the evaluation in format, no questioning of premises.
  Thinking mode:   first demands "attack this plan's biggest assumption."
  Change: same prompt — execution concludes, thinking falsifies first.
  Numbers (illustrative, not a stat): 1 prompt, 2 modes — execution returns 1
                   finished verdict; thinking returns 1 challenge to the premise first.
```

### 5. Harvest flywheel — useful experience compounds, rules self-evolve

A useful lesson from a conversation gets harvested into a seed → a lesson that
keeps recurring is promoted to a real rule → a mistake log prevents repeats →
periodic subtraction keeps the rule set from bloating (a candidate → promoted →
archived lifecycle).

```text
Without it:           Every good lesson you talk through evaporates into chat
                      history.
The move:             Harvest it into a seed; promote the ones that keep recurring
                      into rules.
What changes:         The system accumulates reusable rules — and prunes itself so
                      it does not bloat over time.
Still not guaranteed: Real harvested content and a mature rule library (paid
                      layer).
```

```text
Mini-case: input = "this time we hit the 'started before defining done' trap."
  Not harvested:  next new chat walks straight into the same trap from zero.
  Harvested → seed → recurs → promoted to rule:
                  next kickoff, step one is blocked by that very rule.
  Change: the same trap is not hit a second time.
  Numbers (illustrative, not a stat): not harvested, the same trap recurs across
                  3+ kickoffs; harvested → promoted, it is blocked at step 1 of the next.
```

---

## Free vs. paid boundary

The free edition is meant to be **useful and honest**, not crippled to force
payment. The split, in one table:

| Piece | Community (free) | Pro / service layer |
|---|---|---|
| **Architecture** | The full map — six layers, the closed loop, how they connect. | — |
| **Six-layer interfaces** | The base interface for each layer (profile schema, context/acceptance/review/handoff/harvest templates). | — |
| **The five dynamics** | The *design rationale* + the smallest concrete move for each. | — |
| **Worked examples** | Synthetic, end-to-end sample rooms. | Better before/after examples, mature scenario packs. |
| **Templates** | Core starter templates. | Higher-quality templates tested across many real workflows. |
| **Prompts** | The plain moves described above. | Tuned, mode-specific prompts. |
| **Judgment calibration** | — | Weights, thresholds, and calibrated review / red-team / stop-redo rubrics. |
| **Harvest depth** | The basic harvest move. | The deeper harvest / rule-evolution mechanism. |
| **Real cases & delivery** | — | Real case material; optional human review / concierge setup. |

The honest framing: **Community gives you the bare structure and the blueprint;
the paid layer saves you the time and mistakes of calibrating it alone.** Not
"free is broken, pay to make it work" — you can self-build a working skeleton from
the free pieces. (Full boundary in the product contract
[§5](./community-v0.2-product-contract.md#5-free-vs-paid-boundary).)

> Stated plainly so it can't be mistaken for a dark pattern: nothing here says
> "we found your problem, pay or you can't solve it." The fix is public. Paid help
> only makes the calibrated version faster.

---

## Where to go next

- See it filled in, end to end: [sample room](./sample-room.md) — a synthetic case
  from messy input → breakpoint → filled thread → before/after. For the next
  dynamic up, the
  [advanced multi-role failure→fix loop](./sample-room-advanced.md).
- Build one yourself in ~60 minutes: [walkthrough](./walkthrough.md).
- What the paid layer is actually for: product contract
  [§5 Free vs Paid Boundary](./community-v0.2-product-contract.md#5-free-vs-paid-boundary).

---

# 系统架构（这些零件怎么拼成一个整体 · 中文）

大多数"AI 老是坑我"的问题，根上不是模型问题，是**结构**问题：长项目跑偏、每开一个新对话
就从零开始、没人写下"做完"到底算什么、聊出来的好点子全蒸发进聊天记录。换个更强的模型解决不了
这些，补上一点点对的结构才行。

这一页是地图。它给你**最小闭环**、让工作能跨对话存活的**六层**，以及把这套骨架从"一堆模板"
变成"能用的方法"的**五个动力学**。理论收起来了——第一屏给的是形状，不是讲课。

> **到底真发布了什么，一句话讲清。** 社区版 CLI 只有三个命令——`init` / `doctor basic` /
> `demo`。这一页上其他所有东西——多角色、跨族守卫、判断闭环、模式切换、收割飞轮——都是一套
> **协作方法和结构口径**：是你把规则文件喂给你**自己已经在用的** Claude / Codex / Cursor，
> 由**你亲手编排**实现的。**它不是一个替你自动跑多个 agent 的 CLI。** 它是一种工作方式，模板
> 让这种方式可以反复用。（对齐产品契约
> [§6"v0.2 不得宣称的内容"](./community-v0.2-product-contract.md#6-what-v02-must-not-claim)。）

---

## 最小闭环

一个任务，从头到尾，配上让它不散架的结构：

```text
        ┌──────────────────────────────────────────────────────────┐
        │                                                          │
        ▼                                                          │
   ① 诊断 ──────▶ ② 画像 ──────▶ ③ 上下文 ────▶ ④ 验收 + 守卫       │
   第一个断点      AI 贴着        真正的边界     什么算"做完"？      │
   在哪？          谁来调？        是什么？        信任前先挑战        │
                                                        │           │
                                                        ▼           │
                                          ⑤ 交接 ──────▶ ⑥ 收割 ─────┘
                                          下个对话        把可复用的
                                          接得上          那部分留下
```

闭环才是重点。诊断告诉你从哪开始；中间四层让一件活变得可信；交接把它带到下个对话；收割把一条
可复用规则喂回最前面。少一层，这个环就在那个接缝处漏。

---

## 六层（骨架）

每一层都对应这个仓里已有的资产。每层一两句话——想深入就打开那层的文件。

1. **诊断层 — 找到第一个断点。** 从你感受到的痛点进，被点名那个最该先补的缺失结构。
   → [痛点选择器](./pain-selector.md) · `aict doctor basic` ·
   [断点卡](./breakpoint-card.md) · [自查协议](./self-check.md)

2. **画像层 — 让 AI 懂*你*怎么决策。** 一个小 schema 加一个填好的示例，让助手贴着你的工作
   风格和风险偏好走，而不是一个通用人设。
   → [画像 schema](../templates/profile/profile.schema.json) ·
   [示例画像](../templates/profile/example-profile.json) ·
   [填好的画像](../templates/examples/thread-room/profile.md)

3. **上下文层 — 写下真实的边界。** 目标、受众、现状、约束、非目标——让范围别在项目中途漂移。
   → [上下文模板](../templates/workflows/context.md)

4. **验收 + 守卫层 — 先定义"做完"，信任前先挑战它。** 一条验收线
   （`做完意味着 / 证据是 / 以下情况仍未完成`），加上一道在产出被接受前先攻击它的审查。
   → [验收模板](../templates/workflows/acceptance.md) ·
   [审查模板](../templates/workflows/review.md)

5. **交接层 — 让下个对话不从零开始。** 一张交接卡（现状 / 证据 / 卡点 / 下一步），加上一个
   能接着续的完整 thread 示例，跨工具也能用。
   → [交接模板](../templates/workflows/handoff.md) ·
   [thread-room 示例](../templates/examples/thread-room/handoff.md)

6. **收割层 — 把一件活变成可复用资产。** 把唯一值得留的那个点抓出来、改写成脱敏可公开的版本，
   让它成为下次开工的种子，而不是消失进聊天里。
   → [收割模板](../templates/workflows/harvest.md)

**六层底下，还有两条横切原则：**

- **本地优先 / 不上传。** 不遥测、不联网、不扫全盘。你的工作留在你自己机器上。
  （[隐私](./privacy.md)）
- **单一真源 / 多工具适配。** 一份共享核心契约，每个工具一层薄壳，规则不会在
  Claude / Codex / Cursor / Windsurf / Copilot / Cline 之间分叉成六个互不一致的版本。
  （[手动安装](./manual-setup.md)）

---

## 五个动力学（让骨架活起来的东西）

六层是骨头。这五个动力学是让骨头能动的设计选择。如果你本来就懂 AI 协作，这部分才是值得你看的。
每个都用一个**证据块**表示——固定四行：

- **失败前（Without it）** — 没有这个动作时，失败长什么样。
- **介入点（The move）** — 你做的那一件事。
- **结果变化（What changes）** — 具体变了什么。
- **仍不保证（Still not guaranteed）** — 这个动作*解决不了*什么（以及付费层到底在补什么）。

### 1. 多角色分工 — 下令的不审查自己的活

把*下令 / 执行 / 审查 / 收割*拆给不同角色。核心是权力分立：提方案的那个角色，不是给方案签字
放行的那个角色。

```text
失败前（Without it）:        一个 AI 既写方案又自己打分，自说自话跟自己说"搞定了"，没有独立检查。
介入点（The move）:          给一个独立"守卫"角色一件唯一的活——找漏洞、不执行、不签字放行。
结果变化（What changes）:    它挑出方案漏掉的东西——每步没有责任人、没有一步挂到验收线上——触发返工。
仍不保证（Still not guaranteed）: 守卫挑得准不准，取决于校准好的审查判据（付费层）。
```

> 数字示意（非实测统计）：没有分工时，**第 1 遍**就自己宣布"做完"、没有一步有独立责任人；
> 有守卫这一遍时，动手做之前先有 **8 步里 3 步**被打回标记。

### 2. 判断闭环 — 放行 / 返工 / 停止，配三段式验收闸门

产出不是一看到就信，它要过一道闸门。三档裁决，加上三段式验收检查——**未做 / 已做待验 /
已验收**——其中"已做待验"必须**给证据**，不能光靠嘴说。

```text
失败前（Without it）:        AI 说一句"完成了"，这话就直接进了你的决策。
介入点（The move）:          让它过判断闸门；"已做待验"要求贴出证据（diff、输出、截图）。
结果变化（What changes）:    一查发现根本没真做完 → 裁决是返工，它没能进决策。
仍不保证（Still not guaranteed）: 每一档的阈值仍然要校准（付费层）。
```

> 数字示意（非实测统计）：没有闸门时，到**第 3 轮**才发现产出根本没真做完；有闸门时，那句
> 没验证的"完成了"在**第 1 轮**就被打回。

### 3. 跨族守卫 — 换一个*不同*的模型族来审

审方案时，把它交给一个不同的模型族（比如 Claude 出的方案，让 GPT / Codex 审）。同族 AI 共享
同样的盲区，所以一个模型自己审自己，会漏掉自己这一族的系统性盲点。

```text
失败前（Without it）:        同一个模型自审，漏掉自己这一族天生就有的盲点。
介入点（The move）:          你手动把方案粘进另一个厂商的 AI，让它独立审一遍。
结果变化（What changes）:    跨族这一审，可能挖出第一遍漏掉的洞。
仍不保证（Still not guaranteed）: 守卫的判据、以及分层规则（哪些发现是硬约束 vs. 只作参考）仍需校准（付费层）。
```

```text
迷你案例：输入 = "一份看着完整的方案"。
  同族自审：    "没问题，通过。"
  换不同厂商的 AI 审："这条假设你们这一版都默认成立、但它没验证。"
  变化：一个被同族默认略过的假设被点出来。
  数字示意（非统计）：同族第 2 遍审挑出 0 个新洞；第 1 遍跨族审点出 1 条没验证的假设。
```

> **⚠️ 这一条要看仔细——它最容易被读错。** CLI **不会**自动调两个模型。这里没有任何自动编排。
> 这是一种**方法口径**：是*你*把一个 AI 的方案，自己拿去交给另一个 AI。"跨族守卫"指的是
> **"让一个不同族的模型来审这份活"这个做法本身**——它不是一个替你跑两个模型的功能。
> 这里特意把全页那条声明再说一遍：社区版 CLI 就是 `init` / `doctor basic` / `demo`；多角色、
> 跨族、判断闸门、模式切换、收割这些行为，都是**你亲手编排的协作方法和结构**，不是 CLI 替你
> 跑的 agent。（对齐产品契约
> [§6](./community-v0.2-product-contract.md#6-what-v02-must-not-claim)。）

### 4. 模式切换 — 同一个 AI，按任务切不同工作档

同一个 AI 按手头的任务，在一个声明出来的档里跑：严格执行档、开放思辨档、写作档——每个档有自己
的规则、自己那份自由度。

```text
失败前（Without it）:        一个 prompt 走天下——思辨的时候被流程捆死，执行的时候又太放飞。
介入点（The move）:          开工前先把这个任务的档声明出来。
结果变化（What changes）:    思辨档放开对抗和发散；执行档收紧流程和格式。
仍不保证（Still not guaranteed）: 让每个档真正表现好的那套调教过的提示词（付费层）。
```

```text
迷你案例：输入 = 同一句"帮我评估这个方案"。
  执行档：直接按格式产出评估，不质疑前提。
  思辨档：先要求"先攻击这个方案的最大假设"。
  变化：同一句 prompt，执行档给结论、思辨档先证伪。
  数字示意（非统计）：1 句 prompt、2 个档——执行档给出 1 个收口结论；思辨档先给出 1 条对前提的挑战。
```

### 5. 收割飞轮 — 有用的经验会复利，规则自进化

对话里一条有用的经验被收割成种子 → 一条反复出现的经验被升成正式规则 → 一个错题本防止重复
踩坑 → 定期做减法，不让规则集膨胀（一条候选 → 升正式 → 归档的生命周期）。

```text
失败前（Without it）:        你每天聊出来的好经验，全蒸发进聊天记录里。
介入点（The move）:          把它收割成种子；反复命中的那些升成规则。
结果变化（What changes）:    系统积累起可复用的规则——还会自己做减法，免得越长越臃肿。
仍不保证（Still not guaranteed）: 真实的收割内容和一个成熟的规则库（付费层）。
```

```text
迷你案例：输入 = "这次踩了'没定义做完就开干'的坑"。
  不收割：    下次新对话又从零踩一遍同一个坑。
  收割成种子 → 反复出现 → 升成规则：
              下次开工第一步，就被这条规则拦住。
  变化：同一个坑，第二次不再踩。
  数字示意（非统计）：不收割，同一个坑跨 3+ 次开工反复踩；收割 → 升成规则，下一次开工第 1 步就被拦住。
```

---

## 免费 / 付费边界

免费版的定位是**有用且诚实**，不是为逼你付费而故意做残。这条线，一张表讲清：

| 部分 | 社区版（免费） | Pro / 服务层 |
|---|---|---|
| **架构** | 完整地图——六层、闭环、它们怎么连。 | — |
| **六层接口** | 每层的基础接口（画像 schema，上下文 / 验收 / 审查 / 交接 / 收割模板）。 | — |
| **五个动力学** | 每个的*设计思路* + 最小的那个具体动作。 | — |
| **跑通的示例** | 合成的、端到端的样板间。 | 更好的 before/after 示例、成熟的场景包。 |
| **模板** | 核心起步模板。 | 在大量真实工作流上测过的更高质量模板。 |
| **提示词** | 上面说的那些朴素动作。 | 调教过的、分档的提示词。 |
| **判断校准** | — | 权重、阈值，以及校准过的审查 / 红队 / 停-返工 rubric。 |
| **收割深度** | 基础的收割动作。 | 更深的收割 / 规则进化机制。 |
| **真实案例 & 交付** | — | 真实案例素材；可选的人工 review / 代搭服务。 |

诚实的说法：**社区版给你毛坯结构 + 施工图；付费层给你省下独自校准它的时间和踩过的坑。** 不是
"免费版是残废、付费才能用"——你完全可以拿免费的零件自己搭出一个能跑的骨架。（完整边界见产品
契约 [§5](./community-v0.2-product-contract.md#5-free-vs-paid-boundary)。）

> 说白了，免得被当成"暗黑套路"：这里没有任何一句说"我们找到你的问题了，付钱、不然你解决不了"。
> 解决办法是公开的。付费只是让校准过的那个版本来得更快。

---

## 接下来去哪

- 看一个填好的、端到端的：[样板间](./sample-room.md)——一个合成案例，从乱输入 → 断点 →
  填好的 thread → before/after。想再往上看一层，见
  [进阶的多角色挑错→返工链](./sample-room-advanced.md)。
- 大约 60 分钟自己搭一个：[走一遍](./walkthrough.md)。
- 付费层到底在补什么：产品契约
  [§5 免费 / 付费边界](./community-v0.2-product-contract.md#5-free-vs-paid-boundary)。
