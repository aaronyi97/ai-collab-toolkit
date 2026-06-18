# Contributing

Community contributions are welcome when they preserve the local-first trust
model. This is an experimental project; please keep changes small and well-scoped.

## Trust rules (hard requirements)

- Do not add default network calls.
- Do not add default telemetry or analytics.
- Do not read user directories without an explicit path and a documented reason.
- Do not add strong hook enforcement by default.
- Hook or adapter changes must include a short **threat model** in the pull request.
- Do not contribute private prompts, real personal profiles, customer material,
  browser profiles, tokens, cookies, or API keys. All examples must be synthetic.

## Developer Certificate of Origin (DCO)

By contributing, you certify the [DCO](https://developercertificate.org/): that
you wrote the change or otherwise have the right to submit it under the project's
licenses. Sign off each commit with `git commit -s`, which appends a
`Signed-off-by` line.

## Tests

Run `node --test tests/*.test.js` before opening a PR. CI runs the same on Node 18
and 20. Add tests for any new behavior.

## Licensing

Contributions are submitted under **Apache-2.0** for code and **CC BY 4.0** for
documentation, templates, and examples.
