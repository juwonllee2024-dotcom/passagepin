# Contributing

Keep PassagePin local-first and explicit.

```bash
npm install
npm test
npm run typecheck
npm run lint
npm run build
npm run audit
```

Use Node 20 or newer. Write a failing test before changing normalization, hashing, sealing, comparison, or file handling. Do not add network requests, telemetry, automatic page scanning, broad host permissions, or raw quote persistence by default.

Pull requests should explain the user problem, privacy impact, synthetic test data, and fresh verification output.
