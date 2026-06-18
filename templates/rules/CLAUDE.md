# Claude Instructions

This project follows a shared collaboration contract. The full rules live in
[`_core-contract.md`](./_core-contract.md) (single source of truth). This file is
the Claude-specific shell; read the core contract first, then apply the notes
below.

## Quick contract (mirrors the core)

1. **Conclusion first**, then evidence (files / line ranges / command output),
   then the next action.
2. **Boundaries**: no default network, no hidden telemetry, no copying private
   material, no forced hooks, stay scoped to the project.
3. **Uncertainty**: separate Known / Inferred / Unverified. Prefer a small
   runnable check over a broad claim.
4. **Risky changes**: stop and ask before credentials, billing, deployment,
   production data, dependencies, or machine-wide settings.

## Claude-specific notes

- Treat this `CLAUDE.md` as auto-loaded context; keep it short and let the core
  contract carry the detail (avoid drift between the two).
- Before editing files, state the intended files and why. After editing, report
  the verification commands you ran and what is still unverified.

中文要点：先结论后证据再下一步；默认不联网/不加遥测/不拷私有材料/不强装 hook；不确定分"已知/推测/未验"；动密钥·部署·依赖·全局设置前先停下问。完整规则见 `_core-contract.md`。
