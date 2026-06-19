# Pain Selector

Enter through the pain you feel, not through the architecture. Find the line that
sounds like your week, then follow it to the smallest first action. Every path
below points to a file that already exists in this repo — no dead ends, no
"coming soon".

This is a map of where workflows usually break and what closes the gap. It is not
a paywall: each first action is something you can do yourself, today, for free.

---

### 1. "Every new chat starts from zero."

- **Likely breakpoint:** missing handoff (often missing profile/context too).
- **Community structure:** profile card + context package + handoff note.
- **First action:** write a handoff note — current state, evidence, blocker, next
  action — and paste it as the first message of the next session.
- **Go next:** [handoff template](../templates/workflows/handoff.md) ·
  [context template](../templates/workflows/context.md) ·
  [sample room](./sample-room.md)

### 2. "Long projects drift."

- **Likely breakpoint:** missing thread structure — acceptance and review are not
  carried across sessions.
- **Community structure:** the six-piece thread skeleton (profile, context,
  acceptance, review, handoff, harvest).
- **First action:** write the acceptance line (done means / evidence is / still
  not done if) so every later session has one fixed target to steer by.
- **Go next:** [acceptance template](../templates/workflows/acceptance.md) ·
  [walkthrough](./walkthrough.md)

### 3. "AI gives lots of output, but I do not trust it."

- **Likely breakpoint:** missing acceptance standard and review gate.
- **Community structure:** acceptance standard + review template.
- **First action:** before trusting output, run it through one review pass —
  scope, findings, fix, residual risk — checked against the acceptance line.
- **Go next:** [review template](../templates/workflows/review.md) ·
  [acceptance template](../templates/workflows/acceptance.md)

### 4. "I use multiple tools, but quality is not more stable."

- **Likely breakpoint:** rules drift across tools — each editor has its own copy.
- **Community structure:** one core contract + thin tool shells.
- **First action:** copy `_core-contract.md` once; point each tool shell
  (CLAUDE.md, AGENTS.md, .cursor/rules, …) back to it instead of re-writing rules.
- **Go next:** [manual setup](./manual-setup.md) ·
  [core contract](../templates/rules/_core-contract.md)

### 5. "I create a lot with AI, but nothing accumulates."

- **Likely breakpoint:** missing harvest path.
- **Community structure:** harvest template + a content/knowledge seed.
- **First action:** end a session by writing a harvest block — reusable idea,
  public-safe rewrite, next use — instead of letting it sink into the chat.
- **Go next:** [harvest template](../templates/workflows/harvest.md)

### 6. "I can feel something is wrong, but cannot name it."

- **Likely breakpoint:** missing diagnostic vocabulary.
- **Community structure:** pain selector + self-check + breakpoint card.
- **First action:** run `aict doctor basic --input "<your situation>"`, or paste
  the self-check protocol into the assistant you already use; read the single
  breakpoint card it returns.
- **Go next:** [self-check](./self-check.md) ·
  [breakpoint card](./breakpoint-card.md) · [sample room](./sample-room.md)

---

# 痛点选择器（中文）

从你感觉到的痛点进来，而不是从架构进来。找到那句最像你这一周的话，顺着它走到最小的第一步。
下面每条路径都指向这个仓库里**已经存在**的文件——没有死链，没有"敬请期待"。

这是一张"工作流通常在哪断、用什么补"的地图，不是付费墙：每个"第一步"都是你今天自己就能
免费做的事。

---

### 1. "每个新对话都从零开始。"

- **可能的断点：** 缺交接（往往画像/背景也缺）。
- **社区结构：** 画像卡 + 上下文包 + 交接卡。
- **第一步：** 写一张交接卡——现状、证据、卡点、下一步——粘成下个对话的第一条消息。
- **去哪：** [交接模板](../templates/workflows/handoff.md) ·
  [上下文模板](../templates/workflows/context.md) · [样板间](./sample-room.md)

### 2. "长项目越做越散。"

- **可能的断点：** 缺 thread 结构——验收和审查没有跨对话带过去。
- **社区结构：** 六件套 thread 骨架（画像、背景、验收、审查、交接、收割）。
- **第一步：** 写好验收那句话（做完意味着 / 证据是 / 以下情况仍未完成），让之后每个对话都有
  一个固定靶子可以对照。
- **去哪：** [验收模板](../templates/workflows/acceptance.md) · [走一遍](./walkthrough.md)

### 3. "AI 给一堆产出，但我不敢信。"

- **可能的断点：** 缺验收标准和审查关卡。
- **社区结构：** 验收标准 + 审查模板。
- **第一步：** 信任之前先过一遍审查——范围、发现、修复、剩余风险——拿验收那句话来对照。
- **去哪：** [审查模板](../templates/workflows/review.md) ·
  [验收模板](../templates/workflows/acceptance.md)

### 4. "我用了好几个工具，但质量没更稳。"

- **可能的断点：** 规则在工具间漂移——每个编辑器各存一份。
- **社区结构：** 一个核心契约 + 各工具薄壳。
- **第一步：** 把 `_core-contract.md` 拷一次；让每个工具壳（CLAUDE.md、AGENTS.md、
  .cursor/rules……）都指回它，而不是各写一份规则。
- **去哪：** [手动接入](./manual-setup.md) · [核心契约](../templates/rules/_core-contract.md)

### 5. "我用 AI 产出很多，但什么都没沉淀。"

- **可能的断点：** 缺收割路径。
- **社区结构：** 收割模板 + 一颗内容/知识种子。
- **第一步：** 结束一个对话时写一段收割——可复用的点、脱敏改写、下次怎么用——别让它沉进
  聊天记录里。
- **去哪：** [收割模板](../templates/workflows/harvest.md)

### 6. "我能感觉到不对，但说不出哪不对。"

- **可能的断点：** 缺诊断词汇。
- **社区结构：** 痛点选择器 + 自查 + 断点卡。
- **第一步：** 跑 `aict doctor basic --input "<你的情况>"`，或把自查协议粘进你已经在用的
  助手里；读它返回的那一张断点卡。
- **去哪：** [自查](./self-check.md) · [断点卡](./breakpoint-card.md) ·
  [样板间](./sample-room.md)
