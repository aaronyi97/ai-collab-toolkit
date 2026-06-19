# Walkthrough (curiosity → one artifact in ~60 minutes)

This page takes you from "what is this?" to **one reusable artifact from your own
work** in about an hour. It is local-first: nothing is uploaded, and it introduces
no new commands.

You will leave with a real artifact — a handoff note, a context package, a review
result, or a harvest seed — not just an idea about the framework.

There are two paths. Do Path A first to find your gap, then Path B to close it. If
you already know your gap, skip straight to Path B.

## Path A — CLI diagnostic (≈5 min)

Paste your real situation (redact secrets, keys, customer names, and local paths
first):

```bash
npx ai-collab-toolkit doctor basic --input "<your situation, secrets redacted>"
```

Read the single [breakpoint card](./breakpoint-card.md) it returns. It names the
first missing structure. The `doctor` command itself makes no network calls at
runtime and uploads nothing; the first `npx`/`npm install` does download the
package from the npm registry (after that you can run it offline). For a fully
worked example, see [docs/sample-room.md](./sample-room.md).

No npm? Use the [self-check prompt](./self-check.md) inside the assistant you
already use — same five-check logic, no install.

## Path B — Manual build (≈45 min)

**1. Get the templates (≈5 min).** Either copy these into a test folder:

```text
templates/workflows/context.md
templates/workflows/acceptance.md
templates/workflows/review.md
templates/workflows/handoff.md
templates/workflows/harvest.md
templates/profile/profile.schema.json   (profile is a schema, not a workflow stub; for a filled model use templates/examples/thread-room/profile.md)
```

…or run `aict init` to scaffold a local `.aict/` folder with the same workflow
stubs (handoff, review, harvest, a project-context stub, and an acceptance stub).

**2. Fill the six pieces for one real task (≈30 min).** Use the filled synthetic
example in [templates/examples/thread-room/](../templates/examples/thread-room/)
as a model:

```text
profile      who the assistant is adapting to
context      what is actually in scope (goal, audience, state, constraints, non-goals)
acceptance   what counts as done (done means / evidence is / still not done if)
review       how output is challenged before trust
handoff      how the next session resumes
harvest      what becomes reusable material
```

Keep acceptance concrete: `done means ... / evidence is ... / still not done if ...`.

Each filled example opens with one **labelled summary line** — `Profile:`,
`Project context:`, `Acceptance:`, `Handoff note:`, `Harvest:`. That one line is
what you feed the probe next: `doctor basic` reads **labelled declarations**, not
Markdown headings (`## Handoff` on its own does not count). It is a structural
probe, so give it a short declaration summary — not a whole stack of documents
(a full doc's "blocker" / "still not done if" wording can read as a denial).

**3. Re-check (≈10 min).** Paste one labelled line per piece — the summary lines
from your filled thread:

```bash
npx ai-collab-toolkit doctor basic --input "Profile: solo founder who ships over polishes and makes fast, direct risk calls.
Project context: a weekend note-taking prototype — building the five-screen onboarding for solo founders.
Acceptance: done means a new tester finishes all five onboarding screens unaided.
Handoff note: onboarding screens 1-3 drafted; next session builds screens 4-5 and books a tester.
Harvest: the reusable rule define done before you prompt, ready to seed the next build."
```

When the five pieces are declared with labels, the probe stops flagging them.
Real output (reproducible) — the checks and verdict below; the CLI also prints
Evidence and a Method line:

```text
Structure checks:
- Personal profile: present
- Project context: present
- Acceptance standard: present
- Handoff path: present
- Output harvest path: present

Top breakpoint: No missing structure detected by basic checks. [No missing structure]
Risk: This only proves explicit markers exist for all five checks; it does not prove the content is good.
Next action: Review the quality of each structure before trusting the workflow.
```

Read that caveat carefully. The probe only confirms the **markers exist** — it
does not judge whether the content is good. Judging quality is your job: that is
where the review step (and, if you ever want it, paid calibration) does the work
the checklist cannot.

## Leave with one artifact

Your filled `handoff.md` is the artifact. Paste it as the first message of your
next session and watch the assistant resume without re-explaining. That single
reusable file — not the theory — is the proof the framework changed something.

---

# 走一遍（从好奇到一个成果，约 60 分钟 · 中文）

这一页带你从"这是啥？"走到**一个来自你自己工作的可复用成果**，大概一小时。它本地优先：不
上传任何东西，也不引入新命令。

你最后会拿到一个真实成果——一张交接卡、一个上下文包、一份审查结果，或一颗收割种子——而不只是
"对这套框架有了个概念"。

有两条路。先走 A 找到你的缺口，再走 B 把它补上。如果你已经知道缺口在哪，直接跳到 B。

## 路径 A — CLI 诊断（约 5 分钟）

把你真实的情况粘进去（先脱敏：密钥、key、客户名字、本地路径）：

```bash
npx ai-collab-toolkit doctor basic --input "<你的情况，已脱敏>"
```

读它返回的那一张[断点卡](./breakpoint-card.md)。它点名第一个缺失的结构。`doctor` 命令本身在
运行时不发任何网络请求、也不上传任何东西；但首次 `npx`/`npm install` 会从 npm registry 下载这个
包（之后就能离线运行）。完整跑通的例子见 [docs/sample-room.md](./sample-room.md)。

没装 npm？把[自查提示词](./self-check.md)粘进你已经在用的助手里——同一套五项检查逻辑，不用装。

## 路径 B — 手动搭建（约 45 分钟）

**1. 拿到模板（约 5 分钟）。** 要么把这些拷进一个测试文件夹：

```text
templates/workflows/context.md
templates/workflows/acceptance.md
templates/workflows/review.md
templates/workflows/handoff.md
templates/workflows/harvest.md
templates/profile/profile.schema.json   （profile 是 schema、不是工作流模板；填好的样例见 templates/examples/thread-room/profile.md）
```

……要么跑 `aict init`，它会搭一个本地 `.aict/` 文件夹，带同样的工作流脚手架（handoff、review、
harvest，以及一个 project-context 草稿和一个 acceptance 草稿）。

**2. 给一个真实任务填好六件套（约 30 分钟）。** 拿
[templates/examples/thread-room/](../templates/examples/thread-room/) 里填好的合成示例当样板：

```text
profile     画像     助手要贴着谁来调
context     背景     真正在范围内的是什么（目标/受众/现状/约束/非目标）
acceptance  验收     什么算做完（做完意味着 / 证据是 / 以下情况仍未完成）
review      审查     信任之前怎么挑战产出
handoff     交接     下个对话怎么接上
harvest     收割     什么变成可复用素材
```

验收要具体：`做完意味着…… / 证据是…… / 以下情况仍未完成……`。

每个填好的示例顶部都有一行**带标签的声明**——`个人画像：`、`项目背景：`、`验收：`、`交接卡：`、
`收割：`。下一步喂给探针的就是这一行：`doctor basic` 看的是**带标签的声明**，不是 markdown
标题（光写 `## 交接` 不算）。它是结构探针，所以喂它一段简短的声明摘要——别把整篇文档堆进去
（整篇里"卡点"/"以下情况仍未完成"这类措辞会被当成否定）。

**3. 重新检查（约 10 分钟）。** 每件粘一行带标签的声明——就是你填好那套 thread 各自顶部那行：

```bash
npx ai-collab-toolkit doctor basic --lang zh --input "个人画像：先出活再打磨，风险判断快而直接。
项目背景：一个周末笔记原型，做给独立开发者的五屏新手引导。
验收：做完意味着新测试者不用问人就能走完五屏。
交接卡：1-3 屏画了草稿，下一棒做 4-5 屏并约测试者。
收割：可复用规则动笔前先定义做完，留给下个原型。"
```

当这五件都用带标签的声明写出来，探针就不再报它们。真实输出（可复现）——下面是结构检查与结论部分，
CLI 还会打印 Evidence、方法说明几行：

```text
结构检查：
- 个人画像: present
- 项目背景: present
- 验收标准: present
- 交接路径: present
- 成果收割路径: present

Top breakpoint 首要断点：基础检查未发现缺失结构。 [未发现缺失结构]
Risk 风险：这只说明五类检查都有明确标记，不代表内容质量已经过关。
Next action 下一步：继续检查每个结构的内容质量，再决定是否信任这条工作流。
```

（上面这段中文输出来自 `--lang zh`。）仔细读那句提醒：探针只确认**标记存在**，并不判断内容
好不好。判断质量是你的活儿——这正是审查那一步（以及，如果你哪天想要的话，付费校准）能做、
而清单做不到的事。

## 带走一个成果

你填好的 `handoff.md` 就是那个成果。把它粘成下个对话的第一条消息，看着助手不用你重新解释
就接上。就是这一个可复用的文件——不是理论——证明这套框架真的改变了什么。
