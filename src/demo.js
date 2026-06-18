// Bilingual local demo.
//
// Language selection order:
//   1. flags.lang ("en" | "zh"), if a caller passes it explicitly.
//   2. A "--lang <value>" pair found in process.argv (the top-level CLI does not
//      forward this flag, so the demo reads it directly to stay self-contained).
//   3. Default "en".
//
// The default (no --lang) English output is intentionally byte-for-byte stable
// so existing snapshot-style tests keep passing. The Chinese variant only
// changes the human-readable copy; the structural lines (Network / No files
// written) stay in English in both languages.

function resolveLang(flags) {
  const fromFlag = normalizeLang(flags && flags.lang);
  if (fromFlag) return fromFlag;

  const argv = Array.isArray(flags && flags.argv) ? flags.argv : process.argv;
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--lang") {
      return normalizeLang(argv[index + 1]) || "en";
    }
    if (typeof argv[index] === "string" && argv[index].startsWith("--lang=")) {
      return normalizeLang(argv[index].slice("--lang=".length)) || "en";
    }
  }
  return "en";
}

function normalizeLang(value) {
  if (typeof value !== "string") return null;
  const lower = value.trim().toLowerCase();
  if (lower === "zh" || lower === "cn" || lower === "zh-cn" || lower === "chinese") return "zh";
  if (lower === "en" || lower === "us" || lower === "en-us" || lower === "english") return "en";
  return null;
}

const COPY = {
  en: {
    title: "AICT demo",
    networkDisabled: "Network: disabled",
    networkNotUsed: "Network: not used",
    noFiles: "No files written.",
    demo1Heading: "Demo 1: Conversation to content seed",
    demo1Raw:
      "Raw synthetic conversation: I keep asking for launch ideas, but each answer is a fresh draft with no saved angle.",
    demo1Seed:
      "Harvested seed: A repeatable post about why AI work needs an acceptance line before drafting starts.",
    demo1Rewrite:
      "Public-safe rewrite: Remove names, paths, customer text, and raw transcript phrasing before publishing.",
    demo2Heading: "Demo 2: Messy task to context package",
    demo2Messy:
      "Messy request: Fix the onboarding flow, maybe docs too, and tell me what is broken.",
    demo2Package:
      "Context package: goal=onboarding clarity; current state=unknown break; acceptance=one reproduced issue plus one verified fix; handoff=files, commands, next action.",
    explain:
      "Explain: demo is illustrative only. It does not create a content harvesting product line or read local conversations.",
  },
  zh: {
    title: "AICT 演示",
    // Structural lines stay in English in both languages so machine-readable
    // checks (and existing tests that grep these strings) behave the same.
    networkDisabled: "Network: disabled",
    networkNotUsed: "Network: not used",
    noFiles: "No files written.",
    demo1Heading: "演示 1：把零散对话变成内容种子",
    demo1Raw:
      "原始合成对话：我反复让 AI 给上线点子，但每次都是一段新草稿，没有沉下来的角度。",
    demo1Seed:
      "收割出的种子：一篇可复用的帖子，讲为什么 AI 协作要先把验收标准定下来再动笔。",
    demo1Rewrite:
      "公开前改写：发布前先去掉人名、路径、客户原文和聊天记录腔。",
    demo2Heading: "演示 2：把一团乱的任务变成上下文包",
    demo2Messy:
      "含糊的请求：把新手引导流程修一下，文档可能也要改，再告诉我哪儿坏了。",
    demo2Package:
      "上下文包：目标=新手引导更清楚；现状=具体坏点未知；验收=复现一个问题加验证一处修复；交接=文件、命令、下一步动作。",
    explain:
      "说明：本演示仅作示意，不会创建任何内容收割产品线，也不会读取你本地的对话。",
  },
};

export function runDemo(flags = {}) {
  const lang = resolveLang(flags);
  const t = COPY[lang] || COPY.en;
  const lines = [];

  lines.push(t.title);
  lines.push(flags.noNetwork ? t.networkDisabled : t.networkNotUsed);
  lines.push(t.noFiles);
  lines.push("");
  lines.push(t.demo1Heading);
  lines.push(t.demo1Raw);
  lines.push(t.demo1Seed);
  lines.push(t.demo1Rewrite);
  lines.push("");
  lines.push(t.demo2Heading);
  lines.push(t.demo2Messy);
  lines.push(t.demo2Package);
  if (flags.explain) {
    lines.push("");
    lines.push(t.explain);
  }
  return lines.join("\n") + "\n";
}
