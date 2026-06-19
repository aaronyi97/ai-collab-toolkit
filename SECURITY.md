# Security Policy

## Threat model

`ai-collab-toolkit` is a local-first CLI. Its main risks are:

1. **Data exposure via `doctor` input.** `doctor basic` reads text you provide
   (`--input` / `--input-file` / stdin). If you paste real AI conversation logs,
   they may contain secrets, customer data, or private paths. The `doctor` command
   makes no network calls and never uploads, but **you** are responsible for
   redacting sensitive material before piping it in. `doctor` masks obvious
   secret-like tokens and
   local user paths in its evidence output, but this is a best-effort mask, not a
   DLP system.
2. **Secrets in committed files.** `.gitignore` excludes `*.key`, `.env*`, and
   credential-like files. Never commit API keys or tokens.
3. **Editor rule injection.** `init --tool` writes rule files into your project
   (e.g. `.cursor/rules/`, `CLAUDE.md`). Review generated content before trusting
   it; treat rules as starting points, not authority.

## Defaults (what it will NOT do)

- No network requests in core commands **by design**. `--no-network` documents and
  signals this intent (it sets an env flag and prints a `Network: disabled` label);
  it is **not** a runtime-enforced network sandbox, and nothing in the tool blocks a
  socket. The first `npx ai-collab-toolkit` still contacts the npm registry to fetch
  the package.
- No telemetry, no analytics, no phone-home.
- No whole-disk scan; `init` writes only under the target project.
- No forced hooks, no config overwrites without a `--dry-run` preview.
- Logs do not record raw prompt text, API keys, or private paths.

## Reporting a vulnerability

Please open a private security advisory on the project's GitHub repository
(Security → Report a vulnerability), or open a regular issue at
<https://github.com/aaronyi97/ai-collab-toolkit/issues> if it is not sensitive.
Include reproduction steps and the affected version. This is an experimental
project maintained on a best-effort basis; we aim to acknowledge reports within a
reasonable window.

## Releases

Releases ship a `CHANGELOG.md` and `checksums.txt`. Verify checksums before use.
