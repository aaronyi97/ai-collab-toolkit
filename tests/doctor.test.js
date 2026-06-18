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
  it("prints the five-part contract for the built-in sample", () => {
    const output = runAict(["doctor", "basic"]);

    assert.match(output, /Top breakpoint:/);
    assert.match(output, /Evidence:/);
    assert.match(output, /Risk:/);
    assert.match(output, /Next action:/);
    assert.match(output, /Pro acceleration:/);
    assert.match(output, /Structure checks:/);
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
  it("--lang zh produces a Chinese report and still keeps the 5-part contract", () => {
    const output = runAict(["doctor", "basic", "--lang", "zh"], {
      input: ZH_MISSING_ACCEPTANCE,
    });

    // Chinese surface text present.
    assert.match(output, /首要断点/);
    assert.match(output, /工作流体检/);

    // Five-part contract anchors still present (bilingual labels keep the
    // English keys so downstream tooling/contract stays stable).
    assert.match(output, /Top breakpoint/);
    assert.match(output, /Evidence/);
    assert.match(output, /Risk/);
    assert.match(output, /Next action/);
    assert.match(output, /Pro acceleration/);

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
