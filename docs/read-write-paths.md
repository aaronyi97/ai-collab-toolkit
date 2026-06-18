# Read and Write Paths

| Command | Reads | Writes | Network |
|---|---|---|---|
| aict init | Bundled templates; current working directory path | .aict/** in the current working directory | None |
| aict init --dry-run | Bundled templates; current working directory path | Nothing | None |
| aict init --uninstall | .aict/install-manifest.json | Removes generated files listed in the manifest | None |
| aict doctor basic | stdin, --input, --input-file, or bundled synthetic sample | Nothing | None |
| aict demo | Bundled synthetic examples | Nothing | None |

The CLI must not scan the whole disk. Commands that need a file must require an explicit file path.
