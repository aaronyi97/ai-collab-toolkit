# AICT Community v0.2 Open-Source Quality Execution Handoff

> **For agentic workers:** REQUIRED MODE: Claude Code may decompose and review; Codex owns execution. Implement this handoff task-by-task. Keep the work local-first, public-safe, bilingual, and verifiable.

**Goal:** Make the open-source Community edition feel useful on first contact by adding a strong sample room, a breakpoint card schema, a self-check layer, and a concrete thread skeleton without over-claiming or expanding the CLI.

**Architecture:** Keep `doctor basic` as the current five-check local structural probe. Put the v0.2 first-use experience into public docs and templates first: sample room, card schema, pain selector, self-check protocol, thread templates, and walkthrough. Do not add new commands or hidden intelligence in this execution pass.

**Tech Stack:** Node.js >= 18, ESM modules, `node --test`, Markdown docs/templates, local privacy scan, checksum verification.

---

## 1. Source Of Truth

Read these first:

- `docs/community-v0.2-product-contract.md`
- `README.md`
- `src/doctor.js`
- `src/demo.js`
- `templates/workflows/handoff.md`
- `templates/workflows/review.md`
- `templates/workflows/harvest.md`
- `docs/manual-setup.md`
- `docs/release-checklist.md`
- `package.json`

Current verified baseline:

- `doctor basic` checks five structures only: profile, context, acceptance, handoff, harvest.
- `doctor basic` selects the first missing check in this fixed order: profile -> context -> acceptance -> handoff -> harvest.
- A check is present only when the input includes an explicit strong marker such as `Profile:` or `Project context:`; generic topic words do not make it present. Bare Chinese topic stuffing such as `验收 收割 项目背景 个人画像 交接卡`, including colon-delimited stuffing such as `验收：收割：项目背景：个人画像：交接卡：随便`, must not pass.
- Task 0 negation hardening has been applied: exact negations and nearby negation cues such as `从没写过验收`, `跳过了验收`, `Acceptance: nope`, `Handoff note: TBD`, and `Harvest: none` must read missing; valid no-colon statements such as `完成标准已确认，没有遗漏`, `验收标准是三条用例全过`, and `验收完成了三条用例全过` must stay present.
- When all five checks are present, `doctor basic` reports no missing structure instead of inventing a profile breakpoint.
- Review is part of the broader thread skeleton, not a current `doctor basic` check.
- `Community path` is a v0.2 documentation-level card field, not a shipped CLI field.
- README already has a before/after example, tool-fit explanation, privacy boundary, and v0.2 contract link.
- `src/demo.js` is a short illustrative CLI demo, not the full sample room.
- Existing workflow templates are `handoff`, `review`, and `harvest`; context and acceptance templates are still missing.

Starting worktree note:

- This handoff was written after the v0.2 contract pass. At that point, the worktree already had pre-existing changes in `README.md`, `src/doctor.js`, `checksums.txt`, and new v0.2 docs.
- Do not treat those pre-existing changes as mistakes made by the next executor.
- Before executing this handoff, run `git status --short` and record the baseline. During final verification, compare against that baseline instead of assuming a clean tree.

## 2. Fusion Result

Claude Code-side decomposition:

- Do not spread effort across all v0.2 surfaces at once.
- P0 sample room is the highest leverage open-source quality improvement.
- Card schema must be stabilized before examples reference it.
- P1/P2 should be documentation/template work only.
- Do not touch `doctor.js`, `cli.js`, or `demo.js` for P0-P2 unless a later task explicitly re-scopes implementation.

Codex synthesis:

- Execute in this order: card schema, sample room, README link, pain selector, self-check, thread templates, walkthrough, verification.
- Keep every new user-facing artifact bilingual.
- Treat the open-source edition as complete enough to self-build, not as a broken teaser for paid work.
- Keep paid language secondary and framed as acceleration, not access to the solution.

## 3. Hard Boundaries

Do not:

- Add a sixth `doctor basic` check for review.
- Add `Community path` to the CLI output in this pass.
- Add a new command such as `aict self-check`.
- Rewrite the README from scratch.
- Modify `src/demo.js` to carry the sample room.
- Claim AI diagnosis, hidden intelligence, workflow understanding, guaranteed better model output, or automatic conversation scanning.
- Include private source material, local private paths, raw transcripts, customer text, secrets, or real personal material.
- Make paid help sound required to solve the problem.

Required language:

- `doctor basic` remains a public heuristic / structural probe, not AI diagnosis.
- Community gives a public framework and a self-build path.
- Paid help, if mentioned, accelerates setup, calibration, and review.

## 4. File Map

Create:

- `docs/breakpoint-card.md`
- `docs/sample-room.md`
- `docs/pain-selector.md`
- `docs/self-check.md`
- `docs/walkthrough.md`
- `templates/workflows/context.md`
- `templates/workflows/acceptance.md`
- `templates/examples/thread-room/profile.md`
- `templates/examples/thread-room/context.md`
- `templates/examples/thread-room/acceptance.md`
- `templates/examples/thread-room/review.md`
- `templates/examples/thread-room/handoff.md`
- `templates/examples/thread-room/harvest.md`

Modify:

- `README.md`
- `docs/manual-setup.md` only if the new workflow templates need a short link or setup mention.
- `checksums.txt` only after all edits are complete, via `npm run checksum`.

Do not modify in P0-P2:

- `src/doctor.js`
- `src/cli.js`
- `src/demo.js`
- `tests/*.test.js`
- `bin/aict.js`

Exception: if verification reveals an existing doc/behavior mismatch unrelated to the new docs, stop and report it before changing scope.

## 5. Execution Tasks

### Task 1: Stabilize The Breakpoint Card Schema

**Purpose:** Give all later examples and self-check protocols one output contract.

**Files:**

- Create: `docs/breakpoint-card.md`

**Content requirements:**

- Bilingual English/Chinese.
- Include these fields exactly:
  - `Top breakpoint`
  - `Evidence`
  - `Risk`
  - `Next action`
  - `Community path`
  - `Pro acceleration`
- Say explicitly that current `doctor basic` maps to `Top breakpoint`, `Evidence`, `Risk`, `Next action`, and `Pro acceleration`.
- Say explicitly that `Community path` is a v0.2 documentation-layer extension and is not currently a CLI field.
- Give one short synthetic example.
- Keep `Next action` concrete. Bad: "write better prompts". Good: "Add an acceptance block with done means / evidence is / still not done if."

**User effect:** The user sees a clear, reusable card instead of a vague report.

**Verification:**

Run:

```bash
npm run privacy:scan
```

Expected: private content scan passes.

### Task 2: Build The Filled Sample Room

**Purpose:** Make the open-source framework understandable in one concrete case.

**Files:**

- Create: `docs/sample-room.md`

**Content requirements:**

- Bilingual English/Chinese.
- Use a fully synthetic scenario, preferably the existing public-safe style: a solo founder, weekend prototype, launch/onboarding/product idea.
- Include:
  - Messy input.
  - Command the user can run with `aict doctor basic --input "..."`
  - Expected breakpoint card aligned with `docs/breakpoint-card.md`.
  - Filled profile/context/acceptance/review/handoff/harvest path.
  - Before output.
  - After output.
  - One explicit line: "This line changed the result because ..."
- Do not claim the model became smarter. Say the structure made the work resumable, reviewable, or reusable.
- Design the messy input from the real `doctor basic` algorithm. Example: to make acceptance the top breakpoint, include explicit profile and context markers first, then explicitly deny acceptance.
- Run the command before writing the final expected card. Do not hand-write a card that the CLI cannot reproduce.

**User effect:** A first-time user can see what AICT changes before installing anything deeply.

**Verification:**

Run the sample command manually and compare the result to the sample room:

```bash
node bin/aict.js doctor basic --input "<sample-room messy input>"
```

Expected:

- Top breakpoint in the command output matches the sample room.
- Evidence is consistent with the messy input.
- No private-looking material appears by human review.

Then run:

```bash
npm run privacy:scan
```

Expected: private content scan passes.

Important: the privacy scan is a configured marker blacklist, not a general data-loss-prevention system. Passing it is required but not sufficient. The sample must still be obviously synthetic by human inspection.

### Task 3: Add Minimal README Entry Points

**Purpose:** Let first-time readers find the sample room and card without another README rewrite.

**Files:**

- Modify: `README.md`

**Content requirements:**

- Add one concise English link near the existing before/after or v0.2 contract note.
- Add one concise Chinese link in the Chinese guide.
- Do not rewrite the README first screen.
- Do not remove existing honesty language.

**User effect:** A user can click directly into the filled example from both English and Chinese paths.

**Verification:**

Check that README still answers:

- What this is.
- What Community includes now.
- What is planned next.
- What `doctor basic` is and is not.
- What files it reads/writes at setup time.
- Whether it uses network.
- How to install manually.
- How to uninstall or inspect privacy behavior.

Run:

```bash
npm run privacy:scan
```

Expected: private content scan passes.

### Task 4: Add Pain Selector

**Purpose:** Let users enter through pain, not architecture.

**Files:**

- Create: `docs/pain-selector.md`

**Content requirements:**

- Bilingual English/Chinese.
- Cover these six pains:
  - New chats restart from zero.
  - Long projects drift.
  - AI output is hard to trust.
  - Multi-tool work is inconsistent.
  - Useful ideas disappear into chat.
  - I cannot tell what is broken.
- Each pain must map to:
  - likely breakpoint,
  - Community structure,
  - first action,
  - related doc/template.
- No "coming soon" dead ends.

**User effect:** The user can identify their problem before learning the whole system.

**Verification:**

Run:

```bash
npm run privacy:scan
```

Expected: private content scan passes.

### Task 5: Add Self-Check Protocol

**Purpose:** Let users run the framework inside the assistant they already use.

**Files:**

- Create: `docs/self-check.md`

**Content requirements:**

- Bilingual English/Chinese.
- Include a copy-pasteable agent instruction block.
- The block must:
  - ask the user to paste one stuck AI workflow or conversation excerpt,
  - inspect only the material the user provides,
  - output exactly one breakpoint card using `docs/breakpoint-card.md`,
  - explain that this is checklist-based, not AI diagnosis,
  - ask for redaction of secrets before use.
- Mention that CLI `doctor basic` remains available for local structural probing.
- Do not add an `aict self-check` command.

**User effect:** Users can test AICT with Claude Code, Codex, Cursor, or another assistant without installing anything first.

**Verification:**

Manual check:

- Paste the protocol into one assistant with a synthetic stuck workflow.
- Confirm the output uses the breakpoint card shape.

Command check:

```bash
npm run privacy:scan
```

Expected: private content scan passes.

### Task 6: Add Missing Thread Templates

**Purpose:** Make the self-build skeleton complete.

**Files:**

- Create: `templates/workflows/context.md`
- Create: `templates/workflows/acceptance.md`

**Content requirements:**

- Match the concise style of existing workflow templates.
- Bilingual or bilingual-summary, consistent with repository style.
- `context.md` must include:
  - goal,
  - audience/user,
  - current state,
  - constraints,
  - non-goals.
- `acceptance.md` must include:
  - done means,
  - evidence is,
  - still not done if.
- Do not change `doctor basic` checks.

**User effect:** The six-piece thread skeleton is no longer partly implicit.

**Verification:**

Run:

```bash
npm run privacy:scan
```

Expected: private content scan passes.

### Task 7: Add Filled Thread Example Files

**Purpose:** Give users copyable filled artifacts, not only a narrative sample.

**Files:**

- Create: `templates/examples/thread-room/profile.md`
- Create: `templates/examples/thread-room/context.md`
- Create: `templates/examples/thread-room/acceptance.md`
- Create: `templates/examples/thread-room/review.md`
- Create: `templates/examples/thread-room/handoff.md`
- Create: `templates/examples/thread-room/harvest.md`

**Content requirements:**

- Use the same synthetic scenario as `docs/sample-room.md`.
- Keep the fields consistent with the sample room.
- Keep the example public-safe and generic.
- Include a short note that these are examples, not user data.

**User effect:** Users can see what "filled in" means and adapt the structure to their own project.

**Verification:**

Run:

```bash
npm run privacy:scan
```

Expected: private content scan passes.

### Task 8: Add Walkthrough

**Purpose:** Connect the docs and templates into a 60-minute path.

**Files:**

- Create: `docs/walkthrough.md`
- Optionally modify: `docs/manual-setup.md` with one link to the walkthrough.

**Content requirements:**

- Bilingual English/Chinese.
- Include both paths:
  - CLI path: `npx ai-collab-toolkit doctor basic --input "..."`
  - Manual path: copy templates and fill the six-piece thread skeleton.
- End with one reusable artifact: handoff note, review result, context package, or harvest seed.
- Keep it local-first and no-upload.
- Do not introduce new commands.

**User effect:** A user can go from curiosity to one real artifact without understanding the full theory first.

**Verification:**

Run:

```bash
npm run privacy:scan
```

Expected: private content scan passes.

### Task 9: Final Verification And Checksums

**Purpose:** Keep the release-ready hygiene intact.

**Files:**

- Modify: `checksums.txt` via command only.

**Steps:**

1. Run tests:

```bash
npm test
```

Expected: all current tests pass.

2. Run privacy scan:

```bash
npm run privacy:scan
```

Expected: private content scan passes.

3. Update checksums:

```bash
npm run checksum
```

Expected: `checksums.txt` updated for all current files.

4. Run full check:

```bash
npm run check
```

Expected:

- tests pass,
- private content scan passes,
- checksum verification passes.

5. Confirm diff scope:

```bash
git status --short
git diff --check
git diff --stat
```

Expected:

- Only planned docs/templates/README/checksum files changed.
- No whitespace errors.
- No unexpected code changes.
- Any pre-existing worktree changes recorded at the start are still understood as pre-existing; do not revert them unless explicitly instructed.

## 6. Execution Order

Use this exact order:

1. `docs/breakpoint-card.md`
2. `docs/sample-room.md`
3. README links
4. `docs/pain-selector.md`
5. `docs/self-check.md`
6. `templates/workflows/context.md`
7. `templates/workflows/acceptance.md`
8. `templates/examples/thread-room/*`
9. `docs/walkthrough.md`
10. optional `docs/manual-setup.md` link
11. checksum and full verification

Reason:

- The card schema prevents field drift.
- The sample room is the main first-use value proof.
- The README should link only after the sample exists.
- Self-check and thread templates build on the card/sample language.
- Checksums must be last.

## 7. Definition Of Done

This handoff is complete when:

- A new user can open README and reach a filled example in one click.
- `docs/sample-room.md` shows messy input -> breakpoint card -> filled thread -> after output.
- `docs/self-check.md` lets a user paste a stuck workflow into their own assistant and get one card.
- `templates/workflows/context.md` and `templates/workflows/acceptance.md` complete the thread skeleton.
- Filled examples exist under `templates/examples/thread-room/`.
- No private material is present.
- Privacy scan passes and the examples are visibly synthetic by human inspection.
- No new CLI command is introduced.
- `doctor basic` remains a five-check public structural probe.
- `npm run check` passes.
