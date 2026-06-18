# Agent Instructions

This project follows a shared collaboration contract. The full rules live in
[`_core-contract.md`](./_core-contract.md) (single source of truth). This
`AGENTS.md` is the shell for agent runners (Codex and other AGENTS.md-aware
tools); read the core contract first, then apply the notes below.

## Quick contract (mirrors the core)

- **Response shape**: conclusion first, then evidence (files / line ranges /
  command output), then the next action.
- **Boundaries**: work locally; do not upload project text; do not scan outside
  the current project without an explicit path; no hidden telemetry; no forced
  hooks.
- **Uncertainty**: separate Known / Inferred / Unverified; prefer a small
  runnable check over a broad unverified claim.
- **Before changing files**: state the intended files and why.
  **After changing files**: report verification commands and remaining gaps.
- **Risky changes**: stop and ask before touching credentials, billing,
  deployment, production data, dependencies, or machine-wide settings.

中文要点：先结论后证据再下一步；只在本项目内读写、不外传项目文本、不强装 hook；不确定分"已知/推测/未验"；改文件前先说改哪些和为什么，改完报验证命令；动密钥·部署·依赖·全局设置前先停下问。完整规则见 `_core-contract.md`。
