import fs from "node:fs";
import { redact } from "./redact.js";

// The built-in sample deliberately lands on a DIFFERENT breakpoint than the
// other shipped examples (README → handoff, sample-room → acceptance, this one
// → harvest) so a new user does not see the same gap everywhere and assume the
// probe only ever reports one thing. Here profile/context/acceptance/handoff are
// all written down; only the harvest path is missing.
export const BUILT_IN_SAMPLE = [
  "A solo founder asks an AI assistant to turn a rough product idea into a launch checklist.",
  "Project context: a weekend prototype for solo founders. Profile: the founder prefers direct, fast risk calls.",
  "Acceptance: done means a tester finishes onboarding unaided. Handoff note: the next session resumes from the drafted screens and the open blocker.",
  "There is no harvest path, so reusable output vanishes into the chat."
].join(" ");

// Bilingual (English + Chinese) structure detection.
//
// Each check defines three signal classes:
//   - strongSignals: explicit structured markers. A positive hit => present.
//                    Bare CJK topic nouns need a declaration cue; name-dropping
//                    "验收 收割 项目背景" is not structure.
//   - weakSignals:   generic words retained for debugging/evidence only.
//   - negations:     explicit denials. Any hit forces missing.
//
// Detection scans the input sentence-by-sentence (so a long log cannot be
// judged "present" just because unrelated generic words happen to co-occur far
// apart), then aggregates the signal sets across all sentences. Negation near a
// marker wins over the marker itself: "Acceptance: nope" and "从没写过验收" are
// absence claims, not structure.
const CHECKS = [
  {
    id: "profile",
    label: "Personal profile",
    labelZh: "个人画像",
    strongSignals: [
      "working style:", "decision rule", "decision rules", "profile:", "## profile",
      "工作风格：", "决策规则", "个人画像", "我的偏好"
    ],
    weakSignals: ["profile", "preference", "style", "画像", "偏好", "风格"],
    negations: [
      "no profile", "missing profile", "without profile", "lacks profile",
      "没有画像", "缺画像", "无画像", "没有个人画像"
    ],
    breakpoint: "Personal profile is missing or too vague.",
    breakpointZh: "个人画像缺失或太笼统。",
    risk: "The assistant may optimize for a generic user instead of the way this person actually decides.",
    riskZh: "助手会按一个通用用户去优化，而不是按这个人真实的决策方式。",
    next: "Add a short profile with working style, decision rules, and privacy boundaries.",
    nextZh: "补一段简短画像：工作风格、决策规则、隐私边界。"
  },
  {
    id: "context",
    label: "Project context",
    labelZh: "项目背景",
    strongSignals: [
      "project context", "scope:", "goal:", "background:", "## context",
      "项目背景", "上下文：", "目标：", "范围："
    ],
    weakSignals: ["context", "scope", "goal", "background", "背景", "目标", "范围", "上下文"],
    negations: [
      "no context", "missing context", "without context", "lacks context",
      "没有背景", "缺背景", "无上下文", "没有上下文"
    ],
    breakpoint: "Project context is missing.",
    breakpointZh: "项目背景缺失。",
    risk: "The assistant can produce plausible work that does not match the real project boundary.",
    riskZh: "助手可能产出看似合理、实则不贴合真实项目边界的成果。",
    next: "Add a 5-line context block: goal, audience, current state, constraints, and non-goals.",
    nextZh: "补一段 5 行背景：目标、受众、现状、约束、非目标。"
  },
  {
    id: "acceptance",
    label: "Acceptance standard",
    labelZh: "验收标准",
    strongSignals: [
      "acceptance:", "done means", "done when", "success criteria",
      "验收", "完成标准", "通过标准"
    ],
    weakSignals: ["acceptance", "done", "criteria", "verification", "test", "验收", "完成", "标准", "测试"],
    negations: [
      "no acceptance", "missing acceptance", "without acceptance",
      "acceptance criteria missing", "lacks acceptance",
      "没有验收", "无验收", "缺验收", "没有完成标准"
    ],
    breakpoint: "Acceptance standard is missing.",
    breakpointZh: "验收标准缺失。",
    risk: "The work can look complete while nobody has defined what would count as done.",
    riskZh: "活儿看着像完成了，但根本没人定义过什么才算做完。",
    next: "Write three bullets beginning with done means, evidence is, and still not done if.",
    nextZh: "写三条：做完意味着、证据是、以下情况仍未完成。"
  },
  {
    id: "handoff",
    label: "Handoff path",
    labelZh: "交接路径",
    strongSignals: [
      "handoff note:", "handoff:", "next owner:", "## handoff",
      "交接卡", "交接记录", "下一棒", "续接说明"
    ],
    weakSignals: ["transfer", "handover", "owner", "resume", "交接", "续", "接棒"],
    negations: [
      "no handoff", "missing handoff", "without handoff", "lacks handoff",
      "没有交接", "无交接", "缺交接", "没有下一棒"
    ],
    breakpoint: "Handoff path is missing.",
    breakpointZh: "交接路径缺失。",
    risk: "A future session may restart from scratch or trust stale context.",
    riskZh: "后续对话可能从零重来，或者误信已经过期的上下文。",
    next: "Add a handoff note with current state, evidence, blocker, and next action.",
    nextZh: "补一张交接卡：现状、证据、卡点、下一步。"
  },
  {
    id: "harvest",
    label: "Output harvest path",
    labelZh: "成果收割路径",
    strongSignals: [
      "harvest:", "content seed", "knowledge base", "## harvest",
      "收割", "沉淀", "素材库", "复用清单"
    ],
    weakSignals: ["harvest", "reuse", "saved output", "seed", "收割", "复用", "沉淀", "素材"],
    negations: [
      "no harvest", "missing harvest", "without harvest", "lacks harvest",
      "没有收割", "无收割", "缺收割", "没有沉淀"
    ],
    breakpoint: "Output harvest path is missing.",
    breakpointZh: "成果收割路径缺失。",
    risk: "Useful work disappears into the chat and cannot become reusable material.",
    riskZh: "有用的产出淹没在聊天里，没法变成可复用的素材。",
    next: "Add a small harvest section: reusable idea, public-safe rewrite, and next use.",
    nextZh: "补一小段收割：可复用的点、脱敏改写、下次怎么用。"
  }
];

const CJK_SIGNAL = /[\u3400-\u9fff]/;
const CJK_BARE_MARKERS = CHECKS
  .flatMap((check) => check.strongSignals)
  .map((signal) => signal.toLowerCase())
  .filter((signal) => CJK_SIGNAL.test(signal) && !signal.includes(":") && !signal.includes("："));

const NO_BREAKPOINT = {
  id: "none",
  label: "No missing structure",
  labelZh: "未发现缺失结构",
  status: "present",
  strongSignals: [],
  weakSignals: [],
  negations: [],
  breakpoint: "No missing structure detected by basic checks.",
  breakpointZh: "基础检查未发现缺失结构。",
  risk: "This only proves explicit markers exist for all five checks; it does not prove the content is good.",
  riskZh: "这只说明五类检查都有明确标记，不代表内容质量已经过关。",
  next: "Review the quality of each structure before trusting the workflow.",
  nextZh: "继续检查每个结构的内容质量，再决定是否信任这条工作流。"
};

const EN_MISSING_BEFORE = /(?:\b(?:no|without)\s+(?:real\s+|clear\s+|written\s+|actual\s+|explicit\s+|any\s+|the\s+)?|\b(?:missing|lack(?:s|ing|ed)?|skip(?:s|ped|ping)?)\s+(?:any\s+|the\s+)?)$/i;
const EN_MISSING_AFTER = /^[\W\s]{0,8}(?:(?:is|are|was|were|has been)\s+)?(?:missing|absent|undefined|nope|tbd|not\s+(?:defined|written|set|provided)|never\s+(?:defined|written|set))\b/i;
const EN_EMPTY_FIELD_VALUE = /^(?:nope|none|n\/a|na|tbd|todo|missing|absent|undefined|not\s+(?:defined|written|set|provided)|no\s+(?:acceptance|handoff|harvest|context|profile|standard|criteria|note|path|output)(?:\s+\w+){0,3})$/i;

const ZH_MISSING_BEFORE = /(?:(?:没有|没|从没|从未|还没|尚未)(?:写过|写|做|定|任何|明确|真正|这个|本次|的)*|(?:没写|未写|没定|未定|没做|不做|不写|跳过(?:了)?|缺少|缺失)(?:这个|本次|任何|明确|的)*)$/;
const ZH_MISSING_AFTER = /^[\s，,。！？?：:]{0,2}(?:没有(?:写|定|做)|没写|未写|没定|未定|还没定|缺少|缺失|算了|算了吧|跳过)/;
const ZH_EMPTY_FIELD_VALUE = /^(?:无|没有|暂无|待定|未定|没定|没写|未写|缺失|缺少|跳过|算了|空)$/;
const CJK_DECLARATION_AFTER = /^(?:[:：]|就是|是|为|包括|包含|写清楚|已|已经|完成了|完成|确认|很|清楚|明确|通过|归档|沉淀|保存|整理|输出|内容|素材|下一|先|接手|了|把|没有(?!写|定|做|明确|任何|标准|验收|交接|收割|画像|背景)|无(?!验收|交接|收割|画像|背景))/;
const CJK_LABEL_THEN_DECLARATION_AFTER = /^(?:(?:标准|路径|记录|卡|背景|画像|规则|说明|内容)){1,2}(?:就是|是|为|已|已经|完成了|完成|确认|很|清楚|明确|通过|归档|沉淀|保存|整理|输出|没有(?!写|定|做|明确|任何|标准|验收|交接|收割|画像|背景)|无(?!验收|交接|收割|画像|背景))/;

export function readDoctorInput(options) {
  if (options.inputFile) {
    return { text: fs.readFileSync(options.inputFile, "utf8"), source: "--input-file" };
  }
  if (options.input) {
    return { text: options.input, source: "--input" };
  }
  if (!process.stdin.isTTY) {
    const stdin = fs.readFileSync(0, "utf8");
    if (stdin.trim()) {
      return { text: stdin, source: "stdin" };
    }
  }
  return { text: BUILT_IN_SAMPLE, source: "built-in synthetic sample" };
}

// Split into sentences/segments across both Latin and CJK punctuation, plus
// newlines, so each unit is scanned independently.
function splitSegments(text) {
  return String(text)
    .split(/(?<=[.!?。！？；;])\s*|\n+/)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function signalPositions(segmentLower, needle) {
  const positions = [];
  let fromIndex = 0;
  while (fromIndex < segmentLower.length) {
    const index = segmentLower.indexOf(needle, fromIndex);
    if (index === -1) break;
    positions.push(index);
    fromIndex = index + Math.max(needle.length, 1);
  }
  return positions;
}

function fieldValueAfterSignal(segmentLower, needle, index) {
  const rawAfter = segmentLower.slice(index + needle.length);
  const after = rawAfter.trimStart();
  if (needle.endsWith(":")) {
    return after.trim();
  }
  if (after.startsWith(":") || after.startsWith("：")) {
    return after.slice(1).trim();
  }
  return null;
}

function normalizeFieldValue(value) {
  return value
    .replace(/^[：:\-\s]+/, "")
    .replace(/[。.!?！？；;，,\s]+$/g, "")
    .trim();
}

function isMarkerStuffedFieldValue(value) {
  const normalized = normalizeFieldValue(value).replace(/\s+/g, "");
  return CJK_BARE_MARKERS.some((marker) => {
    if (!normalized.startsWith(marker)) {
      return false;
    }
    const rest = normalized.slice(marker.length);
    return /^[:：，,。.!！？?；;]/.test(rest);
  });
}

function isMissingFieldValue(value) {
  const normalized = normalizeFieldValue(value);
  // A label with no value at all ("acceptance:" / "验收：" with nothing after the
  // colon) is a bare placeholder, not a written structure. Treat it as missing
  // in both languages — otherwise an empty labelled stub reads as present.
  if (normalized.length === 0) {
    return true;
  }
  return EN_EMPTY_FIELD_VALUE.test(normalized) ||
    ZH_EMPTY_FIELD_VALUE.test(normalized) ||
    isMarkerStuffedFieldValue(value);
}

function isNegatedSignal(segmentLower, needle, index) {
  const fieldValue = fieldValueAfterSignal(segmentLower, needle, index);
  if (fieldValue !== null) {
    return isMissingFieldValue(fieldValue);
  }

  const before = segmentLower.slice(Math.max(0, index - 32), index);
  const after = segmentLower.slice(index + needle.length, Math.min(segmentLower.length, index + needle.length + 32));
  return EN_MISSING_BEFORE.test(before) || ZH_MISSING_BEFORE.test(before) ||
    EN_MISSING_AFTER.test(after) || ZH_MISSING_AFTER.test(after);
}

function isBareCjkSignal(needle) {
  return CJK_SIGNAL.test(needle) && !needle.includes(":") && !needle.includes("：");
}

function hasStructuredCjkCue(segmentLower, needle, index) {
  if (!isBareCjkSignal(needle)) {
    return true;
  }

  const after = segmentLower.slice(index + needle.length).replace(/\s+/g, "");
  return CJK_DECLARATION_AFTER.test(after) || CJK_LABEL_THEN_DECLARATION_AFTER.test(after);
}

function isPositiveSignal(segmentLower, needle, index) {
  return !isNegatedSignal(segmentLower, needle, index) && hasStructuredCjkCue(segmentLower, needle, index);
}

function countDistinctPositiveHits(signals, segmentsLower) {
  const hit = new Set();
  for (const signal of signals) {
    const needle = signal.toLowerCase();
    const hasPositiveHit = segmentsLower.some((segment) =>
      signalPositions(segment, needle).some((index) => isPositiveSignal(segment, needle, index))
    );
    if (hasPositiveHit) {
      hit.add(needle);
    }
  }
  return hit;
}

function hasExplicitNegation(check, segmentLower) {
  return check.negations.some((neg) => segmentLower.includes(neg.toLowerCase()));
}

function segmentHasNegatedMarker(check, segmentLower) {
  const markerSignals = [...check.strongSignals, ...check.weakSignals];
  return markerSignals.some((signal) => {
    const needle = signal.toLowerCase();
    return signalPositions(segmentLower, needle).some((index) =>
      isNegatedSignal(segmentLower, needle, index)
    );
  });
}

function segmentEndsWithMarkerQuestion(check, segmentLower) {
  const markerSignals = [...check.strongSignals, ...check.weakSignals];
  return markerSignals.some((signal) => {
    const needle = signal.toLowerCase();
    return signalPositions(segmentLower, needle).some((index) =>
      /^[\s？?，,。.!！]*$/.test(segmentLower.slice(index + needle.length))
    );
  });
}

function nextSegmentDeniesMarker(segmentLower) {
  const trimmed = segmentLower.trim();
  return /^(?:算了吧|算了|不做|跳过)/.test(trimmed) || /^(?:nope|none|tbd)\b/i.test(trimmed);
}

function segmentHasNegatedMarkerAt(check, segmentsLower, index) {
  const segment = segmentsLower[index];
  const nextSegment = segmentsLower[index + 1] || "";
  return (
    segmentHasNegatedMarker(check, segment) ||
    (segmentEndsWithMarkerQuestion(check, segment) && nextSegmentDeniesMarker(nextSegment))
  );
}

function hasNegatedMarker(check, segmentsLower) {
  return segmentsLower.some((segment, index) =>
    hasExplicitNegation(check, segment) || segmentHasNegatedMarkerAt(check, segmentsLower, index)
  );
}

export function analyzeWorkflow(rawText) {
  const text = String(rawText ?? "").trim() || BUILT_IN_SAMPLE;
  const segmentsLower = splitSegments(text).map((segment) => segment.toLowerCase());
  // Guard against an empty split (e.g. text without terminal punctuation).
  if (segmentsLower.length === 0) {
    segmentsLower.push(text.toLowerCase());
  }

  const checks = CHECKS.map((check) => {
    const negationHit = hasNegatedMarker(check, segmentsLower);
    const strongHits = countDistinctPositiveHits(check.strongSignals, segmentsLower);
    const weakHits = countDistinctPositiveHits(check.weakSignals, segmentsLower);

    let status;
    if (negationHit) {
      status = "missing"; // explicit denial always wins
    } else if (strongHits.size >= 1) {
      status = "present"; // only an explicit structured marker counts as present
    } else {
      status = "missing"; // generic topic words alone are not "structure"
    }
    // weakHits is retained for evidence/debugging but no longer promotes to present:
    // a long unstructured log that merely mentions topic words must read as missing.
    void weakHits;

    return {
      ...check,
      status,
      negationHit,
      strongCount: strongHits.size,
      weakCount: weakHits.size,
    };
  });

  const top = checks.find((check) => check.status === "missing") ?? NO_BREAKPOINT;
  const allMissing = checks.length > 0 && checks.every((check) => check.status === "missing");
  return { checks, top, allMissing, evidence: evidenceSentence(text, top) };
}

// A segment is a "bare empty-label line" for `top` when its only tie to the top
// item is a marker label with nothing written after the colon (e.g. "profile:"
// or "验收："). That is a placeholder, not testimony — quoting it as Evidence
// just parrots the empty stub back at the user. A real denial ("no profile",
// "Acceptance: nope", "从没写过验收") carries actual content and stays quotable;
// this only screens out the content-free empty-label case so the caller can fall
// back to the honest "no direct evidence line" note.
function isBareEmptyLabelLine(segmentLower, top) {
  const markerSignals = [...top.strongSignals, ...top.weakSignals];
  let sawEmptyLabel = false;
  for (const signal of markerSignals) {
    const needle = signal.toLowerCase();
    for (const index of signalPositions(segmentLower, needle)) {
      const fieldValue = fieldValueAfterSignal(segmentLower, needle, index);
      // A real denial near the marker (no field value, but "no ..." / "missing"
      // / "从没写过" cues) is quotable content — not a bare label.
      if (fieldValue === null) {
        if (isNegatedSignal(segmentLower, needle, index)) {
          return false;
        }
        continue;
      }
      // A labelled field whose value is a placeholder WORD ("nope", "none",
      // "tbd", "无") is real, quotable evidence. Only a truly empty value
      // (nothing after the colon) is a bare label.
      if (normalizeFieldValue(fieldValue).length === 0) {
        sawEmptyLabel = true;
      } else {
        return false;
      }
    }
  }
  if (!sawEmptyLabel) {
    return false;
  }
  // The line tied to `top` only via empty labels. Make sure the line as a whole
  // has no explicit top-level negation phrase worth quoting either.
  return !hasExplicitNegation(top, segmentLower);
}

// Find the input line that is actual evidence for the *reported* breakpoint.
// We only ever quote a line tied to the top item: an explicit denial of it, a
// negated marker of it, or (for a present "no breakpoint" result) a strong
// marker of it. If nothing in the input relates to the reported item, we return
// null rather than hard-pasting an unrelated first sentence — the caller then
// prints an honest "no direct evidence line" note. (Quoting sentence #1 when it
// has nothing to do with the named gap is misleading.) An empty-label stub
// ("profile:" with nothing after it) is likewise not quoted: see
// isBareEmptyLabelLine — parroting an empty placeholder is not evidence.
function evidenceSentence(text, top) {
  const segments = splitSegments(text);
  const segmentsLower = segments.map((segment) => segment.toLowerCase());
  if (top.status === "missing") {
    const negated = segments.find((segment, index) => {
      const lower = segmentsLower[index];
      if (isBareEmptyLabelLine(lower, top)) {
        return false;
      }
      return hasExplicitNegation(top, lower) || segmentHasNegatedMarkerAt(top, segmentsLower, index);
    });
    if (negated) {
      return redact(negated).slice(0, 260);
    }
  }
  const negationMarkers = top.negations.map((neg) => neg.toLowerCase());
  const strongMarkers = top.strongSignals.map((sig) => sig.toLowerCase());
  const markers = top.status === "missing" ? negationMarkers : strongMarkers;
  const matched = segments.find((segment) => {
    const lower = segment.toLowerCase();
    return markers.some((marker) => lower.includes(marker));
  });
  if (matched) {
    return redact(matched).slice(0, 260);
  }
  // No line relates to the reported item. Be honest instead of quoting an
  // unrelated sentence.
  return null;
}

const TEXT = {
  en: {
    header: "AICT doctor basic",
    network: (off) => "Network: " + (off ? "disabled" : "not used"),
    input: (source) => "Input: " + source,
    structure: "Structure checks:",
    allMissing: "No structured markers found at all — that is itself the signal: the structure is in your head, not written down.",
    top: "Top breakpoint: ",
    evidence: "Evidence: ",
    noEvidence: "no direct evidence line — the marker is simply absent from your input.",
    risk: "Risk: ",
    next: "Next action: ",
    honesty: "Method: public heuristic — a structural probe, not an AI diagnosis. Rules are open; no hidden weights.",
    redaction: (marker) => "Redaction note: sensitive-looking material was masked as " + marker + ".",
    explain: "Explain: doctor basic uses five public bilingual structure checks. Each check scans the input sentence-by-sentence for strong markers, generic weak signals, exact negations, and negation cues near a marker. A check is present only when it hits one explicit strong marker outside a negated context; bare Chinese topic words also need a declaration cue, so keyword stuffing does not count as structure. Generic weak signals are retained for debugging but do not promote a check to present. Exact negations or nearby negation cues force missing. It selects the first missing item. This is a public heuristic (structural probe), not an AI diagnosis; rules are open and no private weights or thresholds are published.",
  },
  zh: {
    header: "AICT 工作流体检（基础版）",
    network: (off) => "Network 网络：" + (off ? "已禁用" : "未使用"),
    input: (source) => "Input 输入来源：" + source,
    structure: "结构检查：",
    allMissing: "五项结构标记一个都没找到——这本身就是信号：结构还在你脑子里，没写下来。",
    top: "Top breakpoint 首要断点：",
    evidence: "Evidence 证据：",
    noEvidence: "没有直接证据句——这个标记在你的输入里根本就没出现。",
    risk: "Risk 风险：",
    next: "Next action 下一步：",
    honesty: "方法说明：public heuristic（公开启发式）——结构启发探针，非 AI 诊断；规则公开，不藏权重。",
    redaction: (marker) => "脱敏说明：疑似敏感内容已被遮罩为 " + marker + "。",
    explain: "Explain 说明：基础体检用五个公开的中英双语结构检查。每个检查按句逐句扫描输入里的强标记、泛词弱信号、精确否定，以及标记附近的否定线索。只有命中明确的强结构标记且不在否定语境里，才判为 present；中文裸主题词还需要像声明一样出现，单纯堆关键词不算结构。泛词弱信号只保留作调试参考，不会把检查项提升为 present。命中精确否定或附近否定线索就强制 missing。然后挑出第一个 missing 的项。这是一个 public heuristic（结构启发探针），不是 AI 诊断；规则公开，不发布任何私有权重或阈值。",
  }
};

// Resolve report language. Honors flags.lang if the CLI passes it; otherwise
// falls back to scanning process.argv for --lang so the flag works end-to-end
// through bin/aict.js even when the arg parser does not forward it.
export function resolveLang(flags = {}) {
  if (flags.lang === "zh" || flags.lang === "en") {
    return flags.lang;
  }
  const argv = Array.isArray(process.argv) ? process.argv : [];
  const index = argv.indexOf("--lang");
  if (index !== -1) {
    const value = (argv[index + 1] || "").toLowerCase();
    if (value === "zh" || value === "en") {
      return value;
    }
  }
  return "en";
}

export function formatDoctorReport({ text, source, flags }) {
  const lang = resolveLang(flags);
  const t = TEXT[lang];
  const result = analyzeWorkflow(text);
  const top = result.top;
  const label = lang === "zh" ? top.labelZh : top.label;
  const lines = [];
  lines.push(t.header);
  lines.push(t.network(flags.noNetwork));
  lines.push(t.input(source));
  lines.push("");
  lines.push(t.structure);
  for (const check of result.checks) {
    const checkLabel = lang === "zh" ? check.labelZh : check.label;
    lines.push("- " + checkLabel + ": " + check.status);
  }
  if (result.allMissing) {
    lines.push("");
    lines.push(t.allMissing);
  }
  lines.push("");
  lines.push(t.top + (lang === "zh" ? top.breakpointZh : top.breakpoint) + " [" + label + "]");
  lines.push(t.evidence + (result.evidence ?? t.noEvidence));
  lines.push(t.risk + (lang === "zh" ? top.riskZh : top.risk));
  lines.push(t.next + (lang === "zh" ? top.nextZh : top.next));
  lines.push(t.honesty);
  const redactedAll = redact(text);
  if (redactedAll !== String(text)) {
    const marker = redactedAll.includes("/Users/<redacted>") ? "/Users/<redacted>" : "<redacted-secret>";
    lines.push(t.redaction(marker));
  }
  if (flags.explain) {
    lines.push("");
    lines.push(t.explain);
  }
  return lines.join("\n") + "\n";
}
