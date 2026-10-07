# PassagePin 📌

## Pin the sentence. Check it later.

PassagePin turns one selected web passage into a small, local integrity pin. Reselect the passage later and get an immediate answer:

- **EXACT** — normalized words match the pin.
- **CHANGED** — selected words differ.
- **MISSING** — nothing was selected.

No account. No cloud. No AI. No background monitoring.

> A pin proves equality with a later selection. It does not prove authorship, truth, legal admissibility, or that a server showed the same content.

## Try it locally

```bash
npm install
npm run build
npm run demo
```

Open <http://127.0.0.1:4177/>. Select the sentence, create a pin, then select it again and load the JSON file to verify. The offline CLI uses the same core:

```bash
npm run verify -- examples/verified-pin.json examples/current.txt
# EXACT
```

Change one word in `examples/current.txt` and the result becomes `CHANGED`.

## Install the extension locally

1. Run `npm run build`.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Choose **Load unpacked** and select this repository’s `dist/` directory.
5. Select a passage on a page and explicitly click the PassagePin toolbar action.
6. Create a local pin. Later, select the passage again, load the pin, and verify.

The extension requests only `activeTab` and `scripting`. Chrome grants temporary access to the current tab after a user action; it does not grant permanent access to every site. See [Chrome activeTab documentation](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab).

## Privacy boundary

- Default pins store page origin/path, timestamp, normalized length, word count, and SHA-256 digest.
- Query strings and fragments are removed from URLs.
- The raw quote is stored only when the user explicitly checks **Store quote text in file for local citation**.
- Pin verification reads a user-selected local JSON file and the user-selected current passage.
- No `fetch`, `XMLHttpRequest`, storage sync, analytics, or background page scan exists.
- The extension never edits, blocks, or submits a page.

SHA-256 uses the browser’s local Web Crypto `SubtleCrypto.digest()` API. See the [MDN digest reference](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest).

## Why not a screenshot or bookmark?

A screenshot preserves appearance but is hard to compare mechanically. A bookmark preserves a destination, not the words you saw. Quote clippers are useful for collecting text and citations; PassagePin tests a narrower operation: portable, user-invoked equality checking for one passage. The research note lists nearby tools and the unresolved demand hypothesis.

## Status and experiment

This is a narrow MVP: Chrome MV3 panel, opt-in quote storage, plain JSON seal, offline CLI, local demo, tests, CI, and explicit limitations. The seven-day experiment is ten people who save web evidence. Can they understand EXACT/CHANGED/MISSING without instruction, and do at least three prefer it to a screenshot or bookmark?

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md). Keep the extension explicit, local, and small.

## License

MIT. See [LICENSE](LICENSE).
