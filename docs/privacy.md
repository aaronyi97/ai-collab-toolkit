# Privacy

AI Collaboration Toolkit Community is local-first.

Default behavior:

- No network requests
- No telemetry
- No uploads
- No full-disk scans
- No default workflow interception
- No forced hook installation
- No hidden background process

doctor basic accepts text from stdin, --input, --input-file, or a bundled synthetic sample. It prints one evidence sentence after redacting likely secrets and local absolute user paths.

The CLI does not write logs by default. If a future command adds logging, it must document the path, opt-in behavior, retention rule, and redaction rule before release.
