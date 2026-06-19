# AICT Community v0.2 Product Contract

Status: planning contract, not a shipped feature list.

Audience: maintainers, early testers, and contributors deciding what Community v0.2 must become.

This document is public-safe. It defines the Community edition contract only. It does not publish private production material, paid templates, client material, or hidden diagnostic weights.

## 0. Locked Position

AICT Community v0.2 is not trying to become a general agent framework.

It is an open, local-first AI collaboration framework for people who already use tools such as Claude Code, Codex, Cursor, Windsurf, Copilot, Cline, or similar rule-file-based assistants, but whose work still breaks down in long tasks, new sessions, review, handoff, or harvest.

The free edition must help a user answer one practical question:

> Where is my AI collaboration workflow breaking, and what minimum structure would stop the bleeding?

The paid layer, if offered, is not a paywall around the free skeleton. It sells speed, calibration, mature examples, scenario-specific packs, and optional human review for people who do not want to build the full system themselves.

## 1. Target User

### Primary user

The first user is an AI-heavy individual or small operator who already uses AI tools but does not have a stable collaboration system.

Typical examples:

- Independent creator using AI for writing, research, content, or products.
- Solo founder using AI across planning, coding, launch, and writing.
- Consultant or knowledge worker using AI for client work.
- Small team lead who needs AI outputs to be reviewable and resumable.
- Developer or operator who can run a CLI, but does not want to spend weeks designing a personal AI operating system.

### The middle-customer test

The commercial target is the user in the middle:

- Too advanced to be impressed by generic prompt tips.
- Too busy or non-DIY to build and maintain a full collaboration system from scratch.
- Already feels pain from single-session AI work.
- Will pay to save time, avoid confusion, and get a mature default.

If a user wants to self-build everything from public templates, Community should respect that. They are not the main paid conversion target.

### Not the primary user

Community v0.2 should not be optimized for:

- People who have never used AI tools.
- Pure prompt collectors.
- Users who only want a one-click autonomous agent.
- Hardcore framework tinkerers who prefer building every piece themselves.
- Closed autonomous agents that ignore external rule files and already provide their own memory/collaboration system.

## 2. Core Pain Map

Community v0.2 should frame user pain in plain language before showing architecture.

| User symptom | Likely breakpoint | Community structure that addresses it |
|---|---|---|
| "Every new chat starts from zero." | Missing profile, context, or handoff | Profile card, context package, handoff note |
| "Long projects get messy." | Missing thread structure | Thread state, acceptance, review, handoff |
| "AI gives lots of output, but I do not trust it." | Missing acceptance and review gate | Acceptance standard, review template, guardrail questions |
| "I use multiple tools, but quality is not more stable." | Rules drift across tools | One core contract plus thin tool adapters |
| "I create a lot with AI, but nothing accumulates." | Missing harvest path | Harvest template and content/knowledge seed |
| "I can feel something is wrong, but cannot name it." | Missing diagnostic vocabulary | Pain selector, self-check, breakpoint card |

The product should not begin with "we have a system." It should begin with "this is where your workflow is breaking."

## 3. First-Use Experience Contract

Community v0.2 succeeds only if a new user feels a real difference quickly.

### 5-minute contract

Within 5 minutes, a user should be able to:

1. Recognize at least one familiar pain.
2. Run or read one self-check path.
3. Receive or understand one top breakpoint.
4. See one next action they can paste back into their AI tool.

Pass condition:

> The user can say: "I thought my model was bad, but this shows my workflow is missing X."

### 15-minute contract

Within 15 minutes, a user should be able to:

1. Inspect a before/after example.
2. See how profile, context, acceptance, handoff, review, and harvest fit together.
3. Understand why this is more than a single prompt.
4. Choose between CLI setup and manual template setup.

Pass condition:

> The user can say: "I can see how this framework would make my AI sessions more continuous."

### 60-minute contract

Within 60 minutes, a user should be able to:

1. Initialize or manually copy the skeleton into a test project.
2. Fill a minimal profile/context/acceptance/handoff set.
3. Run one small workflow through the skeleton.
4. Produce one reusable artifact: a handoff note, review result, context package, or harvest seed.

Pass condition:

> The user has one actual artifact from their own work, not just an idea about the framework.

## 4. Community v0.2 Product Surface

Community v0.2 should be built around seven public surfaces.

### 4.1 Pain selector

A simple entry point that asks the user which pain they have:

- New chats restart from zero.
- Long projects drift.
- AI output is hard to trust.
- Multi-tool work is inconsistent.
- Useful ideas disappear into chat.
- I cannot tell what is broken.

This can be implemented as documentation first, then CLI or prompt-driven flow later.

### 4.2 Self-check protocol

The free diagnostic path should be described honestly:

- It is not an AI diagnosis.
- It is not a hidden model.
- It is a structured checklist and output schema.
- The user's own assistant can apply it to a pasted conversation or project notes.
- The CLI `doctor basic` remains a local structural probe.

The value comes from pre-classifying common AI collaboration breakpoints and forcing the output into a useful shape.

### 4.3 Breakpoint card

The core output should be one card, not a long report.

Required fields:

```text
Top breakpoint:
Evidence:
Risk:
Next action:
Community path:
Pro acceleration:
```

`Top breakpoint`, `Evidence`, `Risk`, and `Next action` map to the current
`doctor basic` shape (those four are what the CLI prints). `Community path` and
`Pro acceleration` are **documentation-layer fields the CLI does not print**:
`Community path` is the v0.2 extension that explains what the open framework gives
the user before any paid option is mentioned, and `Pro acceleration` is an honest,
optional note about a not-yet-shipped paid layer — never required to fix the gap.
If the CLI has not implemented an extended field yet, docs must not present it as
already shipped.

The card should avoid vague advice. "Write better prompts" is not acceptable. "Add an acceptance block with done means / evidence is / still not done if" is acceptable.

### 4.4 Minimal thread skeleton

Community v0.2 should make the thread architecture concrete enough to self-build.

Important distinction:

- `doctor basic` is the current five-check structural probe: profile, context, acceptance, handoff, harvest.
- The thread skeleton is the broader working framework. It includes review as a workflow gate, but Community v0.2 does not have to make review a sixth `doctor basic` check unless the README, tests, and implementation are updated together.

Minimum pieces:

```text
profile        who the assistant is adapting to
context        what task/project is actually in scope
acceptance     what counts as done
review         how output is challenged before trust
handoff        how the next session resumes
harvest        what becomes reusable material
```

This is the main difference from a one-off prompt. The framework should show how work survives across sessions.

### 4.5 Sample room

Community v0.2 needs at least one filled example, not only empty templates.

The sample room should include:

- A messy input.
- The detected breakpoint.
- A filled profile/context/acceptance/handoff/review/harvest path.
- The before/after output.
- The exact line where the framework changed the result.

The sample must be synthetic or properly anonymized.

### 4.6 Multi-tool adapters

The existing one-core-contract-plus-thin-shells approach should remain.

Community must keep one source of truth for collaboration rules. Tool adapters should not fork the framework into six inconsistent versions.

Required tools:

- Claude / Claude Code
- Codex / AGENTS.md-style agents
- Cursor
- Windsurf
- GitHub Copilot
- Cline

Each adapter should answer:

```text
Where should this file be copied?
What does this tool load automatically?
Where is the shared core contract?
How do I verify the tool read it?
```

### 4.7 Privacy and trust docs

Community v0.2 must keep the local-first trust boundary:

- No default upload.
- No telemetry.
- No default network call.
- No whole-disk scan.
- No forced hooks.
- No hidden background process.
- No private example material.
- No default overwrite without a clear path.

Any future scanning of conversations or repositories must be explicit, path-scoped, explainable, and dry-run friendly.

## 5. Free vs Paid Boundary

The free edition should be useful and honest. It should not be crippled to force payment.

### Community gives

Current shipped baseline:

- Public framework.
- Basic CLI.
- Basic doctor.
- Manual setup path.
- Core templates.
- Multi-tool adapters.
- Clear privacy and safety boundaries.

v0.2 planned additions:

- One or more synthetic sample rooms.
- A self-check protocol.
- A breakpoint card schema.

Community should let a capable user self-build a working skeleton.

### Paid layer may give

- Faster setup.
- Personalized profile calibration.
- Deeper multi-breakpoint diagnosis.
- Calibrated judgment guardrails: review, red-team, stop/redo, and release criteria tuned to the user's workflow.
- Mature scenario packs.
- Better before/after examples.
- Human review or concierge setup.
- Higher-quality templates tested across many real workflows.
- Ongoing updates and support boundaries.

The public copy should frame this as:

```text
Community helps you see and build the skeleton.
Paid help saves the time and mistakes of building it alone.
```

### Dark-pattern line

Do not say:

```text
We found your problem. Pay or you cannot solve it.
```

Say:

```text
Here is the public framework and minimum fix. If you want the calibrated version faster, paid help can accelerate it.
```

## 6. What v0.2 Must Not Claim

Community v0.2 must not claim:

- It is an autonomous agent framework.
- It understands the user's workflow like a human consultant.
- `doctor basic` is an AI-powered diagnosis.
- The tool can inspect all private conversations automatically.
- The framework replaces judgment.
- The framework guarantees better model output.
- The Community edition contains the full production system.
- Paid materials are required to benefit from the open framework.

Honest positioning is a feature. Over-claiming will destroy trust faster than missing features.

## 7. Implementation Priorities

Community v0.2 should be implemented in this order.

### P0: Make the first-use value visible

Deliver:

- README first-screen rewrite around pain and before/after.
- Link to this contract or a shorter public roadmap.
- One strong before/after sample.
- One filled sample room.
- One breakpoint card example.

Why:

If the user cannot feel the value before installing, the rest will not matter.

### P1: Add the self-check layer

Deliver:

- Pain selector document.
- Agent-readable self-check prompt/protocol.
- Breakpoint card schema.
- Examples for English and Chinese inputs.

Why:

This lets users evaluate the framework inside the AI tool they already use, not only through the CLI.

### P2: Make the thread skeleton concrete

Deliver:

- Minimal thread folder/template.
- Filled profile/context/acceptance/review/handoff/harvest files.
- Manual setup instructions.
- One "run this through your assistant" walkthrough.

Why:

This is what separates the framework from a prompt pack.

### P3: Strengthen doctor basic without over-claiming

Deliver:

- Keep rules public.
- Keep output to one top breakpoint.
- Add more adversarial examples.
- Make Chinese and English behavior equally clear.
- Keep evidence redaction.
- Keep the five-check scope unless the project deliberately expands `doctor basic`; if review becomes a sixth check, update README, tests, examples, and this contract in the same change.

Why:

The doctor should support the experience, not pretend to be the whole product.

### P4: Tighten trust and release hygiene

Deliver:

- Update privacy manifest if paths change.
- Update read/write path docs.
- Keep private-content scan passing.
- Keep checksums current before release.
- Keep docs/templates license boundaries clear.

Why:

The product asks users to paste or structure sensitive work. Trust is part of the product, not paperwork.

## 8. Acceptance Criteria

Community v0.2 is acceptable only if all four groups pass.

### Product acceptance

- A new user can identify the target pain within 5 minutes.
- The repo contains at least one filled before/after sample.
- The repo shows a concrete thread skeleton, not only empty templates.
- The user can choose CLI or manual setup.
- The paid boundary is clear without making Community feel broken.

### Diagnostic acceptance

- The free diagnostic path outputs one top breakpoint.
- The output includes evidence, risk, next action, and a clear Community or Pro acceleration path when that surface is implemented.
- It does not call itself intelligent diagnosis.
- It handles explicit negation correctly.
- It does not reward keyword stuffing as structure.

### Trust acceptance

- No default network behavior.
- No telemetry.
- No whole-disk scan.
- No private source material in examples.
- Any future scanning feature is path-scoped and opt-in.
- The private-content scan passes.

### Maintenance acceptance

- Tests pass.
- Release checklist remains usable.
- New public docs do not contradict README.
- Tool adapters still point to one shared core contract.
- The contract says what is planned vs what is shipped.

## 9. First Paid-Validation Bridge

This section is for product direction only. Community docs should not over-sell paid products before they exist.

Once Community v0.2 can show the pain clearly, the first paid validation should use a small, bounded manual package:

```text
Input: one stuck AI workflow or conversation excerpt
Output: one breakpoint card, one repaired thread skeleton, one next-action test
Boundary: not ongoing consulting, not unlimited rewrite, not full system migration
```

The goal of the first 20-30 manual deliveries is learning:

- Which pain users will pay to solve.
- Which fixes repeat.
- Which parts can become templates.
- Which parts require human judgment.
- How long each delivery takes.
- Whether users feel the result was worth paying for.

If this learning loop does not exist, low-price manual delivery becomes busywork.

## 10. v0.2 One-Sentence Definition of Done

Community v0.2 is done when a user can bring one messy AI workflow, see the top structural break, understand the minimum thread framework that fixes it, and leave with one reusable artifact, without uploading private data or buying anything.
