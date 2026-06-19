# Breakpoint Card (output schema)

The breakpoint card is the one-screen output shape AICT speaks everywhere: the
`doctor basic` CLI, the [self-check protocol](./self-check.md), and the
[sample room](./sample-room.md) all use this same format. It is a **card, not a
report** — one visible break, with the evidence for it and one concrete next
action, so you can act in minutes instead of reading pages.

## Fields

```text
Top breakpoint:    the single most important missing structure
Evidence:          the exact line(s) in your own input that show the gap
Risk:              what goes wrong if this gap stays open
Next action:       one concrete, paste-back step (not "write better prompts")
Community path:    what the open framework already gives you to close the gap
Pro acceleration:  what paid help would speed up — never required to fix it
```

## What maps to the CLI today

`aict doctor basic` produces four of these fields, verbatim:

- `Top breakpoint`
- `Evidence`
- `Risk`
- `Next action`

`Community path` and `Pro acceleration` are **documentation-layer fields. They are
not CLI fields** — `aict doctor basic` does not print a `Community path:` or a
`Pro acceleration:` line. Docs, the self-check protocol, and filled examples add
those lines by hand: `Community path` points at the open template that closes the
gap, and `Pro acceleration` is an honest, optional note about what a (not-yet-shipped)
paid layer would speed up — never something you need to fix the gap. If you only
read raw CLI output, you will see the four fields above, not these two.

The CLI also prints a standing `Method:` line (`public heuristic — a structural
probe, not an AI diagnosis`). That disclosure is not part of the card; it is a
permanent honesty note about what `doctor basic` is.

## Keep `Next action` concrete

A useful next action names the structure to add and the shape it should take.

- Too vague: `write better prompts`
- Concrete: `Add an acceptance block with done means / evidence is / still not done if.`

## One synthetic example

Synthetic input: a solo founder's weekend prototype where profile and project
context are written down, but acceptance, handoff, and harvest are explicitly
absent. `aict doctor basic` reports acceptance as the top break. The card below
shows the four fields the CLI prints, plus the two doc-layer lines (`Community
path` and `Pro acceleration`) a reader or assistant adds by hand:

```text
Top breakpoint:   Acceptance standard is missing.
Evidence:         There is no acceptance standard, no handoff note, and no harvest path for the reusable parts.
Risk:             The work can look complete while nobody has defined what would count as done.
Next action:      Write three bullets beginning with done means, evidence is, and still not done if.
Community path:   Copy templates/workflows/acceptance.md and fill done means / evidence is / still not done if.   ← docs layer, not printed by the CLI
Pro acceleration: (optional) A paid layer could compare multiple breakpoints and scenario patterns — never required to fix this gap.   ← docs layer, not printed by the CLI
```

Watch this exact case run from messy input to filled thread in
[docs/sample-room.md](./sample-room.md).

---

# 断点卡（输出格式 · 中文）

断点卡是 AICT 各处统一的"一屏输出"格式：`doctor basic` 命令、[自查协议](./self-check.md)、
[样板间](./sample-room.md)用的都是这一种格式。它是**一张卡，不是一篇报告**——只报一个最该
先补的断点，连同证据和一个具体的下一步，让你几分钟内能动手，而不是读好几页。

## 字段

```text
Top breakpoint 首要断点：最该先补的那一个缺失结构
Evidence 证据：你自己输入里能看出这个缺口的原句
Risk 风险：这个缺口不补会出什么问题
Next action 下一步：一个具体、能粘回去就用的动作（不是"把提示词写好点"）
Community path 社区路径：开源框架已经给了你什么，可以自己把缺口补上
Pro acceleration 进阶加速：付费能帮你省什么时间——但补缺口本身从不需要付费
```

## 现在哪些字段是 CLI 真出的

`aict doctor basic` 会原样输出其中四个字段：

- `Top breakpoint` 首要断点
- `Evidence` 证据
- `Risk` 风险
- `Next action` 下一步

`Community path` 社区路径和 `Pro acceleration` 进阶加速都是**文档层字段，不是 CLI 字段**——
`aict doctor basic` 既不打印 `Community path:` 也不打印 `Pro acceleration:` 这两行。是文档、
自查协议和填好的示例**手动**补上：`Community path` 指向能补缺口的开源模板，`Pro acceleration`
是一条诚实、可选的说明，讲一个（尚未发布的）付费层能帮你省什么时间——补缺口本身从不需要它。
你只看命令行原始输出，看到的是上面那四个字段，不是这两行。

CLI 还会固定打印一行 `Method:`（`public heuristic — 结构启发探针，非 AI 诊断`）。这行不属于
卡片，它是一条常驻的诚实声明，说明 `doctor basic` 到底是什么。

## `Next action` 要具体

一个有用的下一步会点名"补哪个结构、补成什么形状"。

- 太空：`把提示词写好点`
- 具体：`补一段验收：做完意味着 / 证据是 / 以下情况仍未完成。`

## 一个合成示例

合成输入：一个独立开发者的周末原型，画像和项目背景都写下来了，但验收、交接、收割都被明确说
"没有"。`aict doctor basic` 报出验收是首要断点。下面这张卡是 CLI 真打印的四个字段，外加两行
文档层手动补的（`Community path` 和 `Pro acceleration`）：

```text
Top breakpoint 首要断点：验收标准缺失。
Evidence 证据：这轮没有验收，完成标准还没定，也没有交接，可复用的部分也没有沉淀。
Risk 风险：活儿看着像完成了，但根本没人定义过什么才算做完。
Next action 下一步：写三条：做完意味着、证据是、以下情况仍未完成。
Community path 社区路径：把 templates/workflows/acceptance.md 拷过来，填上做完意味着 / 证据是 / 以下情况仍未完成。   ← 文档层，CLI 不打印
Pro acceleration 进阶加速：（可选）付费层能对比多个断点和场景模式——但补这个缺口本身从不需要它。   ← 文档层，CLI 不打印
```

到 [docs/sample-room.md](./sample-room.md) 看这个例子从乱输入一路跑到填好的 thread。
