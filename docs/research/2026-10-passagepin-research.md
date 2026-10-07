# PassagePin research — 2026-10-07

## Confirmed facts

- Chrome’s `activeTab` permission gives temporary access after an explicit user action, avoiding persistent access to every site: <https://developer.chrome.com/docs/extensions/develop/concepts/activeTab>.
- Web Crypto’s `SubtleCrypto.digest()` supports asynchronous SHA-256 digests in the browser: <https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest>.
- Existing quote tools already save selected text with sources and export citations, for example [Web Research Clipper](https://github.com/datwordsmith/Web-Clipper) and [QuoteClipper](https://chromewebstore.google.com/detail/quoteclipper-%E2%80%93-save-cite/nofdipimngofldkadmocpefaclmoipjh).
- Existing page monitors watch selected page regions and notify on changes, such as [Page Monitor](https://mobilestalk.net/get-in-browser-alerts-when-a-website-changes/) and similar Chrome extensions.

## Gap and hypothesis

Quote libraries optimize retrieval. Page monitors optimize recurring alerts. PassagePin tests a smaller, portable primitive between them: a user chooses one passage, carries one local JSON pin, and checks equality only when they choose to revisit it. The product is useful only if people understand the result and return to verify; that is not yet proven.

## Candidate review

1. **Raw quote clipper:** rejected; existing tools already solve capture and citation well.
2. **Always-on page monitor:** rejected; crowded and requires recurring permissions/notifications.
3. **PassagePin:** selected; one explicit action, one local artifact, one binary answer, no background access.

## Business hypothesis

First ten users: students, journalists, policy researchers, and people tracking web instructions. Free open-source core may lead to paid team evidence workflows later, but no revenue is assumed. The seven-day experiment is the smallest test.
