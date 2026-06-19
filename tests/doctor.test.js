import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { analyzeWorkflow, formatDoctorReport } from "../src/doctor.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cliPath = path.join(repoRoot, "bin", "aict.js");

function runAict(args, options = {}) {
  return execFileSync(process.execPath, [cliPath, ...args], {
    cwd: options.cwd ?? repoRoot,
    encoding: "utf8",
    env: { ...process.env, AICT_TEST: "1" },
    input: options.input,
  });
}

// Fully synthetic fixtures. No private content.

// A Chinese workflow prompt that is well structured: it carries explicit
// strong markers for every check, so every check should read present.
const ZH_STRUCTURED = [
  "项目背景：这是一个周末原型，目标：两天内做出一个落地页。",
  "个人画像：我的偏好是直给风险判断，决策规则是先砍后加。",
  "验收：完成标准是三条用例全过，通过标准写清楚了。",
  "交接：下一棒接手时读这段，续接现状和卡点。",
  "收割：把可复用的点沉淀进素材库，方便复用。",
].join("\n");

// A Chinese prompt that explicitly says the acceptance standard is absent.
const ZH_MISSING_ACCEPTANCE = [
  "项目背景：给一个独立开发者做内容助手。",
  "个人画像：工作风格偏直接，决策规则清楚。",
  "这轮没有验收，完成标准还没定。",
].join("\n");

// Negated rewrites that still contain strong marker words. These should not be
// counted as real structure merely because they mention 验收 / 收割.
const ZH_REWRITTEN_NEGATED_ACCEPTANCE = [
  "项目背景：给一个独立开发者做内容助手。",
  "个人画像：工作风格偏直接，决策规则清楚。",
  "交接卡：下一棒先补验收标准。",
  "收割：把可复用素材归档。",
  "这轮我们从没写过任何验收标准。",
].join("\n");

const ZH_SKIPPED_ACCEPTANCE_AND_HARVEST = [
  "项目背景：给一个独立开发者做内容助手。",
  "个人画像：工作风格偏直接，决策规则清楚。",
  "交接卡：下一棒先补缺口。",
  "我们跳过了验收，收割？算了吧。",
].join("\n");

const EN_NEGATED_MARKER_VALUES = [
  "Project context: weekend prototype for solo founders.",
  "Profile: founder prefers direct risk calls.",
  "Acceptance: nope.",
  "Handoff note: TBD.",
  "Harvest: none.",
].join(" ");

const ZH_STRUCTURED_WITH_NEGATIVE_VALUE_WORDS = [
  "项目背景：完成无障碍设计的范围界定。",
  "个人画像：决策规则是无论大小先砍后加。",
  "验收：没有阻塞缺陷，三条用例全过。",
  "交接卡：未来接手者先读当前状态。",
  "收割：沉淀可复用素材。",
].join("\n");

const EN_STRUCTURED_WITH_NEGATIVE_VALUE_WORDS = [
  "Project context: ship the prototype with no downtime.",
  "Profile: prefer direct risk calls.",
  "Acceptance: done when no errors remain.",
  "Handoff note: future owner reads current state first.",
  "Harvest: save the reusable launch checklist.",
].join(" ");

const ZH_NATURAL_NEGATION_NEAR_MARKERS = [
  "这个需求没什么大问题，项目背景很清楚。",
  "个人画像：决策规则是先砍后加。",
  "验收：三条用例全过。",
  "这步我还没验完，交接卡下一棒先读当前状态。",
  "这次先不做别的，收割了一批可复用素材。",
].join("\n");

const ZH_KEYWORD_STUFFING = "今天随便聊聊。验收 收割 项目背景 个人画像 交接卡。";
const ZH_COLON_KEYWORD_STUFFING = "验收：收割：项目背景：个人画像：交接卡：随便。";

const ZH_NO_COLON_VALID_ACCEPTANCE = [
  "项目背景：给一个独立开发者做内容助手。",
  "个人画像：工作风格偏直接，决策规则清楚。",
  "完成标准已确认，没有遗漏。",
  "验收没有问题，三条用例全过。",
  "交接卡：下一棒先读当前状态。",
  "收割：把可复用素材归档。",
].join("\n");

const ZH_NO_COLON_DECLARATIONS = [
  "项目背景就是做一个落地页。",
  "个人画像：风格直接。",
  "验收标准是三条用例全过。",
  "交接卡下一棒先读现状。",
  "收割内容保存到素材库。",
].join("\n");

const ZH_SHORT_FIELD_VALUES = [
  "项目背景：测试。",
  "个人画像：直接。",
  "验收：三条过。",
  "交接卡：下一棒。",
  "收割：归档。",
].join("\n");

const EN_NATURAL_NEGATION_NEAR_MARKERS = [
  "There is no rush here but project context stays the launch tool.",
  "Profile: prefer direct risk calls.",
  "Done when none of the tests fail.",
  "Handoff note: future owner reads current state first.",
  "Harvest: save the reusable launch checklist.",
].join(" ");

// An English long log that sprinkles generic weak words (goal, test, reuse,
// profile) across many unrelated sentences, but contains NO structured marker
// and NO real structure. The old literal matcher would flag these present;
// the new heuristic should still report missing because no single sentence
// carries a strong marker and weak signals are diluted across the log.
const EN_LONG_LOG = [
  "Monday: we chatted about the weather and then the goal of grabbing coffee.",
  "Someone mentioned a test they took in school years ago, totally unrelated.",
  "We joked that the office plant has more personality than my dating profile.",
  "Later the team debated whether to reuse the old whiteboard or buy a new one.",
  "A long tangent about commute times, lunch options, and weekend plans followed.",
  "Nobody wrote down what the project actually is or how anyone would resume it.",
  "The thread drifts for pages without any structure, criteria, or handoff note.",
  "More small talk about a movie, a podcast, and a friend's new puppy.",
].join("\n");

describe("doctor basic — contract and redaction", () => {
  it("prints the four-part contract for the built-in sample", () => {
    const output = runAict(["doctor", "basic"]);

    assert.match(output, /Top breakpoint:/);
    assert.match(output, /Evidence:/);
    assert.match(output, /Risk:/);
    assert.match(output, /Next action:/);
    assert.match(output, /Structure checks:/);
    // The unconditional "Pro acceleration" upsell line was removed: Community
    // doctor must not advertise an unshipped paid layer in its core output.
    assert.equal(output.includes("Pro acceleration"), false);
  });

  it("includes the honesty / public-heuristic disclosure", () => {
    const output = runAict(["doctor", "basic"]);
    assert.match(output, /public heuristic/);
    assert.match(output, /not an AI diagnosis/);
  });

  it("uses real user input from stdin without exposing local paths", () => {
    const output = runAict(["doctor", "basic", "--no-network"], {
      input: "We ask the model to draft a launch plan. The acceptance criteria and handoff are missing. Local path /Users/alex/private/key.txt should not print raw.",
    });

    assert.match(output, /Top breakpoint:/);
    assert.equal(output.includes("/Users/alex/private"), false);
    assert.equal(output.includes("/Users/<redacted>"), true);
    assert.match(output, /Network: disabled/);
  });
});

describe("doctor basic — bilingual heuristic", () => {
  it("judges a well-structured Chinese workflow as present, not all missing", () => {
    const { checks } = analyzeWorkflow(ZH_STRUCTURED);
    const byId = Object.fromEntries(checks.map((c) => [c.id, c.status]));

    // Every check carries an explicit Chinese strong marker -> present.
    assert.equal(byId.profile, "present", "profile should be present");
    assert.equal(byId.context, "present", "context should be present");
    assert.equal(byId.acceptance, "present", "acceptance should be present");
    assert.equal(byId.handoff, "present", "handoff should be present");
    assert.equal(byId.harvest, "present", "harvest should be present");

    // And it must NOT collapse to "everything missing" the way the old
    // English-only literal matcher did for Chinese input.
    const missing = checks.filter((c) => c.status === "missing");
    assert.equal(missing.length, 0, "no check should be missing for fully structured zh input");
  });

  it("respects an explicit Chinese negation (没有验收 -> acceptance missing)", () => {
    const { checks } = analyzeWorkflow(ZH_MISSING_ACCEPTANCE);
    const byId = Object.fromEntries(checks.map((c) => [c.id, c.status]));

    assert.equal(byId.acceptance, "missing", "explicit 没有验收 forces acceptance missing");
    // Profile is explicitly structured here, so it should still be present:
    assert.equal(byId.profile, "present", "structured profile stays present despite the negation elsewhere");
  });

  it("respects rewritten Chinese negation near strong marker words", () => {
    const { checks, top, evidence } = analyzeWorkflow(ZH_REWRITTEN_NEGATED_ACCEPTANCE);
    const byId = Object.fromEntries(checks.map((c) => [c.id, c.status]));

    assert.equal(byId.profile, "present");
    assert.equal(byId.context, "present");
    assert.equal(byId.acceptance, "missing", "从没写过任何验收标准 must force acceptance missing");
    assert.equal(byId.handoff, "present");
    assert.equal(byId.harvest, "present");
    assert.equal(top.id, "acceptance");
    assert.match(evidence, /从没写过任何验收标准/);
  });

  it("respects skipped Chinese acceptance and abandoned harvest", () => {
    const { checks } = analyzeWorkflow(ZH_SKIPPED_ACCEPTANCE_AND_HARVEST);
    const byId = Object.fromEntries(checks.map((c) => [c.id, c.status]));

    assert.equal(byId.acceptance, "missing", "跳过了验收 must force acceptance missing");
    assert.equal(byId.harvest, "missing", "收割？算了吧 must force harvest missing");
  });

  it("treats structured markers with negative placeholder values as missing", () => {
    const { checks, evidence } = analyzeWorkflow(EN_NEGATED_MARKER_VALUES);
    const byId = Object.fromEntries(checks.map((c) => [c.id, c.status]));

    assert.equal(byId.profile, "present");
    assert.equal(byId.context, "present");
    assert.equal(byId.acceptance, "missing", "Acceptance: nope should not count as present");
    assert.equal(byId.handoff, "missing", "Handoff note: TBD should not count as present");
    assert.equal(byId.harvest, "missing", "Harvest: none should not count as present");
    assert.match(evidence, /Acceptance: nope/);
  });

  it("keeps Chinese structures present when negative words are part of valid values", () => {
    const { checks, top } = analyzeWorkflow(ZH_STRUCTURED_WITH_NEGATIVE_VALUE_WORDS);
    const byId = Object.fromEntries(checks.map((c) => [c.id, c.status]));

    assert.equal(byId.profile, "present");
    assert.equal(byId.context, "present");
    assert.equal(byId.acceptance, "present", "没有阻塞缺陷 is a valid acceptance value");
    assert.equal(byId.handoff, "present");
    assert.equal(byId.harvest, "present");
    assert.equal(top.id, "none");
  });

  it("keeps English structures present when no/not appear in valid values", () => {
    const { checks, top } = analyzeWorkflow(EN_STRUCTURED_WITH_NEGATIVE_VALUE_WORDS);
    const byId = Object.fromEntries(checks.map((c) => [c.id, c.status]));

    assert.equal(byId.profile, "present");
    assert.equal(byId.context, "present");
    assert.equal(byId.acceptance, "present", "no errors remain is a valid acceptance value");
    assert.equal(byId.handoff, "present");
    assert.equal(byId.harvest, "present");
    assert.equal(top.id, "none");
  });

  it("keeps Chinese structures present when nearby negation words do not modify the marker", () => {
    const { checks, top } = analyzeWorkflow(ZH_NATURAL_NEGATION_NEAR_MARKERS);
    const byId = Object.fromEntries(checks.map((c) => [c.id, c.status]));

    assert.equal(byId.context, "present", "没什么 must not negate 项目背景");
    assert.equal(byId.handoff, "present", "还没验完 must not negate 交接卡");
    assert.equal(byId.harvest, "present", "不做别的 must not negate 收割");
    assert.equal(top.id, "none");
  });

  it("keeps English structures present when nearby no/none do not modify the marker", () => {
    const { checks, top } = analyzeWorkflow(EN_NATURAL_NEGATION_NEAR_MARKERS);
    const byId = Object.fromEntries(checks.map((c) => [c.id, c.status]));

    assert.equal(byId.context, "present", "no rush must not negate project context");
    assert.equal(byId.acceptance, "present", "none of the tests fail is a valid done-when condition");
    assert.equal(top.id, "none");
  });

  it("does not accept bare Chinese keyword stuffing as structure", () => {
    const { checks, top } = analyzeWorkflow(ZH_KEYWORD_STUFFING);
    const present = checks.filter((c) => c.status === "present");

    assert.equal(present.length, 0, "bare topic nouns must not yield present: " + present.map((c) => c.id).join(","));
    assert.equal(top.status, "missing");
  });

  it("does not accept colon-delimited Chinese keyword stuffing as structure", () => {
    const { checks, top } = analyzeWorkflow(ZH_COLON_KEYWORD_STUFFING);
    const present = checks.filter((c) => c.status === "present");

    assert.notEqual(top.id, "none");
    assert.ok(present.length < 5, "colon-delimited topic nouns must not yield all present");
  });

  it("keeps no-colon Chinese acceptance statements present when 没有 describes the value", () => {
    const { checks, top } = analyzeWorkflow(ZH_NO_COLON_VALID_ACCEPTANCE);
    const byId = Object.fromEntries(checks.map((c) => [c.id, c.status]));

    assert.equal(byId.acceptance, "present", "完成标准已确认/验收没有问题 should not read as missing acceptance");
    assert.equal(top.id, "none");
  });

  it("keeps natural no-colon Chinese declarations present", () => {
    const { checks, top } = analyzeWorkflow(ZH_NO_COLON_DECLARATIONS);
    const byId = Object.fromEntries(checks.map((c) => [c.id, c.status]));

    assert.equal(byId.context, "present", "项目背景就是... should count as a context declaration");
    assert.equal(byId.acceptance, "present", "验收标准是... should count as an acceptance declaration");
    assert.equal(top.id, "none");
  });

  it("keeps no-colon Chinese completion phrasing present", () => {
    const input = [
      "项目背景：给一个独立开发者做内容助手。",
      "个人画像：工作风格偏直接。",
      "验收完成了三条用例全过。",
      "交接卡：下一棒先读当前状态。",
      "收割：把可复用素材归档。",
    ].join("\n");
    const { checks, top } = analyzeWorkflow(input);
    const byId = Object.fromEntries(checks.map((c) => [c.id, c.status]));

    assert.equal(byId.acceptance, "present", "验收完成了... should not require a colon");
    assert.equal(top.id, "none");
  });

  it("does not mistake short Chinese field values for marker stuffing", () => {
    const { top } = analyzeWorkflow(ZH_SHORT_FIELD_VALUES);

    assert.equal(top.id, "none");
  });

  it("does not invent a missing profile breakpoint when all checks are present", () => {
    const { top } = analyzeWorkflow(ZH_STRUCTURED);

    assert.equal(top.id, "none");
    assert.equal(top.status, "present");
  });

  it("does NOT flag an English long log full of weak words as present", () => {
    const { checks } = analyzeWorkflow(EN_LONG_LOG);

    // The log scatters goal/test/reuse/profile but has no real structure.
    // No check should be falsely promoted to present.
    const present = checks.filter((c) => c.status === "present");
    assert.equal(
      present.length,
      0,
      "weak words spread across a long unstructured log must not yield present: " +
        present.map((c) => c.id).join(",")
    );

    // Sanity: at least one breakpoint is reported as the top.
    const { top } = analyzeWorkflow(EN_LONG_LOG);
    assert.equal(top.status, "missing");
  });
});

describe("doctor basic — --lang", () => {
  it("--lang zh produces a Chinese report and still keeps the 4-part contract", () => {
    const output = runAict(["doctor", "basic", "--lang", "zh"], {
      input: ZH_MISSING_ACCEPTANCE,
    });

    // Chinese surface text present.
    assert.match(output, /首要断点/);
    assert.match(output, /工作流体检/);

    // Four-part contract anchors still present (bilingual labels keep the
    // English keys so downstream tooling/contract stays stable).
    assert.match(output, /Top breakpoint/);
    assert.match(output, /Evidence/);
    assert.match(output, /Risk/);
    assert.match(output, /Next action/);

    // The Pro acceleration upsell line is gone from the zh report too.
    assert.equal(output.includes("Pro acceleration"), false);

    // Honesty disclosure localized but still says public heuristic.
    assert.match(output, /public heuristic/);
  });

  it("default report language is English", () => {
    const output = formatDoctorReport({
      text: ZH_MISSING_ACCEPTANCE,
      source: "unit-test",
      flags: { noNetwork: true },
    });
    assert.match(output, /AICT doctor basic/);
    assert.match(output, /Top breakpoint:/);
    // No Chinese banner in the default English report.
    assert.equal(output.includes("首要断点"), false);
  });

  it("all five structure checks are listed (5-element completeness)", () => {
    const output = runAict(["doctor", "basic", "--lang", "en"], { input: EN_LONG_LOG });
    for (const label of [
      "Personal profile",
      "Project context",
      "Acceptance standard",
      "Handoff path",
      "Output harvest path",
    ]) {
      assert.match(output, new RegExp(label));
    }
  });
});
