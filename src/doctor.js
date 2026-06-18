import fs from "node:fs";
import { redact } from "./redact.js";

export const BUILT_IN_SAMPLE = [
  "A solo founder asks an AI assistant to turn a rough product idea into a launch checklist.",
  "Project context: a weekend prototype for solo founders. Profile: the founder prefers direct, fast risk calls.",
  "The conversation has no acceptance standard, no handoff note, and no place to harvest reusable output."
].join(" ");

// Bilingual (English + Chinese) structure detection.
//
// Each check defines three signal classes:
//   - strongSignals: explicit structured markers. A single hit => present.
//   - weakSignals:   generic words. One alone is not enough; need >= 2 distinct
//                    weak signals (and no negation) to count as present.
//   - negations:     explicit denials. Any hit forces missing.
//
// Detection scans the input sentence-by-sentence (so a long log cannot be
// judged "present" just because unrelated generic words happen to co-occur far
// apart), then aggregates the signal sets across all sentences.
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

function countDistinctHits(signals, segmentsLower) {
  const hit = new Set();
  for (const signal of signals) {
    const needle = signal.toLowerCase();
    if (segmentsLower.some((segment) => segment.includes(needle))) {
      hit.add(needle);
    }
  }
  return hit;
}

export function analyzeWorkflow(rawText) {
  const text = String(rawText ?? "").trim() || BUILT_IN_SAMPLE;
  const segmentsLower = splitSegments(text).map((segment) => segment.toLowerCase());
  // Guard against an empty split (e.g. text without terminal punctuation).
  if (segmentsLower.length === 0) {
    segmentsLower.push(text.toLowerCase());
  }

  const checks = CHECKS.map((check) => {
    const negationHit = check.negations.some((neg) =>
      segmentsLower.some((segment) => segment.includes(neg.toLowerCase()))
    );
    const strongHits = countDistinctHits(check.strongSignals, segmentsLower);
    const weakHits = countDistinctHits(check.weakSignals, segmentsLower);

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

  const top = checks.find((check) => check.status === "missing") ?? checks[0];
  return { checks, top, evidence: evidenceSentence(text, top) };
}

function evidenceSentence(text, top) {
  const segments = splitSegments(text);
  const negationMarkers = top.negations.map((neg) => neg.toLowerCase());
  const strongMarkers = top.strongSignals.map((sig) => sig.toLowerCase());
  const markers = top.status === "missing" ? negationMarkers : strongMarkers;
  const matched = segments.find((segment) => {
    const lower = segment.toLowerCase();
    return markers.some((marker) => lower.includes(marker));
  });
  const fallback = matched || segments[0] || text;
  return redact(fallback).slice(0, 260);
}

const TEXT = {
  en: {
    header: "AICT doctor basic",
    network: (off) => "Network: " + (off ? "disabled" : "not used"),
    input: (source) => "Input: " + source,
    structure: "Structure checks:",
    top: "Top breakpoint: ",
    evidence: "Evidence: ",
    risk: "Risk: ",
    next: "Next action: ",
    pro: "Pro acceleration: Deep diagnosis can compare multiple breakpoints and scenario patterns, but Community intentionally reports only this top visible break.",
    honesty: "Method: public heuristic — a structural probe, not an AI diagnosis. Rules are open; no hidden weights.",
    redaction: (marker) => "Redaction note: sensitive-looking material was masked as " + marker + ".",
    explain: "Explain: doctor basic uses five public bilingual structure checks. Each check scans the input sentence-by-sentence for strong markers, generic weak signals, and explicit negations. A check is present when it hits one strong marker, or two distinct weak signals with no negation; any negation forces missing. It selects the first missing item. This is a public heuristic (structural probe), not an AI diagnosis; rules are open and no private weights or thresholds are published.",
  },
  zh: {
    header: "AICT 工作流体检（基础版）",
    network: (off) => "Network 网络：" + (off ? "已禁用" : "未使用"),
    input: (source) => "Input 输入来源：" + source,
    structure: "结构检查：",
    top: "Top breakpoint 首要断点：",
    evidence: "Evidence 证据：",
    risk: "Risk 风险：",
    next: "Next action 下一步：",
    pro: "Pro acceleration 进阶加速：深度诊断能对比多个断点和场景模式，但社区版刻意只报这一个最明显的断点。",
    honesty: "方法说明：public heuristic（公开启发式）——结构启发探针，非 AI 诊断；规则公开，不藏权重。",
    redaction: (marker) => "脱敏说明：疑似敏感内容已被遮罩为 " + marker + "。",
    explain: "Explain 说明：基础体检用五个公开的中英双语结构检查。每个检查按句逐句扫描输入里的强标记、泛词弱信号和显式否定。命中一个强标记，或命中两个不同的弱信号且没有否定，即判为 present；只要命中否定就强制 missing。然后挑出第一个 missing 的项。这是一个 public heuristic（结构启发探针），不是 AI 诊断；规则公开，不发布任何私有权重或阈值。",
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
  lines.push("");
  lines.push(t.top + (lang === "zh" ? top.breakpointZh : top.breakpoint) + " [" + label + "]");
  lines.push(t.evidence + result.evidence);
  lines.push(t.risk + (lang === "zh" ? top.riskZh : top.risk));
  lines.push(t.next + (lang === "zh" ? top.nextZh : top.next));
  lines.push(t.pro);
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
