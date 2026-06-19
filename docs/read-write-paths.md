# Read and Write Paths

| Command | Reads | Writes | Network |
|---|---|---|---|
| aict init | Bundled templates; current working directory path | .aict/** in the current working directory | None |
| aict init --tool &lt;name&gt; | Bundled templates; current working directory path | .aict/** plus the selected tool's rule file: CLAUDE.md, AGENTS.md, .cursor/rules/ai-collab.mdc, .windsurf/rules/ai-collab.md, .github/copilot-instructions.md, or .clinerules. Existing files are skipped, never overwritten; all writes are recorded in .aict/install-manifest.json | None |
| aict init --dry-run | Bundled templates; current working directory path | Nothing | None |
| aict init --uninstall | .aict/install-manifest.json | Removes generated files listed in the manifest | None |
| aict doctor basic | stdin, --input, --input-file, or bundled synthetic sample | Nothing | None |
| aict demo | Bundled synthetic examples | Nothing | None |

The CLI must not scan the whole disk. Commands that need a file must require an explicit file path.
