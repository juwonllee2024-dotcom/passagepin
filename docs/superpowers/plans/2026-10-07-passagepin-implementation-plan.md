# PassagePin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a local Chrome MV3 passage pin that creates a privacy-preserving JSON digest and verifies a later selection as EXACT, CHANGED, or MISSING.

**Architecture:** Pure TypeScript core owns normalization, SHA-256 hashing, canonical sealing, integrity verification, and comparison. A tiny content script provides an explicit toolbar panel; a demo page and Node CLI exercise the same core without a server dependency.

**Tech Stack:** TypeScript, Web Crypto API, Chrome MV3 `activeTab` and `scripting`, esbuild, Vitest, Node 20+.

**Spec:** `docs/superpowers/specs/2026-10-07-passagepin-design.md`

## Global Constraints

- No network request, telemetry, account, AI, background scan, or persistent host permission.
- Default pin stores digest, normalized length, and word count only; raw quote requires explicit opt-in.
- Query strings and fragments are removed from recorded URLs.
- User must select both current page text and local pin file for verification.
- Public release includes README, SECURITY.md, CONTRIBUTING.md, CHANGELOG, examples, CI, and verification record.

## Review Focus

- Whitespace-only changes must remain `EXACT` after normalization; test in Task 1.
- Empty or absent current selection must be `MISSING`; test in Task 1.
- Tampered seal or field must be rejected before comparison; test in Task 1.
- Default pins must not contain raw quote text; test in Task 1.
- The UI must not create or verify without an explicit selection and local file; cover in Task 2 smoke scenario.

### Task 1: Pure pin core

**Files:**
- Create: `src/pin.ts`
- Test: `tests/pin.test.ts`

**Interfaces:**
- Produces `buildPin(input)`, `verifyIntegrity(pin)`, `comparePin(pin, currentText)`, `canonicalize(value)`, and `sha256Text(value)`.

- [ ] Write failing tests for normalization, URL stripping, opt-in quote storage, stable SHA-256 sealing, tamper rejection, and EXACT/CHANGED/MISSING comparison.
- [ ] Run `npm test -- --reporter=dot`; expected RED because `src/pin.ts` does not exist.
- [ ] Implement minimal pure core using Web Crypto SHA-256 and sorted-key canonical JSON.
- [ ] Run the focused tests; expected GREEN.
- [ ] Commit `feat: add passage pin core`.

### Task 2: Browser and demo flow

**Files:**
- Create: `src/content.ts`, `src/service-worker.ts`, `src/demo.ts`, `extension/manifest.json`, `demo/index.html`
- Test: `examples/README.md`, HTTP smoke commands

**Interfaces:**
- Consumes Task 1 core.
- Produces explicit selection panel, local JSON download, local file verification, and demo page.

- [ ] Build panel that reports selection length/word count, requires explicit selection, and offers opt-in quote storage.
- [ ] Add local file input for verification; show only `EXACT`, `CHANGED`, `MISSING`, or integrity error.
- [ ] Add MV3 service worker using only `activeTab` and `scripting`.
- [ ] Add a demo page using the same core.
- [ ] Build and smoke-test `/`, `/demo.js`, and a traversal path.
- [ ] Commit `feat: add local browser passage flow`.

### Task 3: CLI, docs, and release evidence

**Files:**
- Create: `src/cli.ts`, `scripts/build.mjs`, `scripts/serve.mjs`, `examples/verified-pin.json`, `examples/current.txt`, `README.md`, `SECURITY.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `LICENSE`, `.github/workflows/ci.yml`, `docs/research/...`, `docs/verification/...`
- Modify: `package.json`, `tsconfig.json`, `eslint.config.mjs`

**Interfaces:**
- CLI: `npm run verify -- pin.json current.txt` prints `EXACT`, `CHANGED`, or `MISSING` and exits nonzero only for invalid input/integrity.

- [ ] Add offline CLI and a synthetic verified fixture.
- [ ] Add docs, research boundaries, license, CI, and verification record.
- [ ] Run fresh test, typecheck, lint, build, audit, CLI, HTTP, diff, secret, and security checks.
- [ ] Commit, create the public repository, push, publish `v0.1.0`, and record URL/CI/metrics/SHA-256.
