# PassagePin design

## One-line value

Pin one important passage now; reselect it later and know whether the words are EXACT, CHANGED, or MISSING.

## User and problem

Students, journalists, researchers, policy teams, and anyone collecting evidence from the web often return to a page and discover that the sentence moved, changed, or disappeared. Quote clippers save text for later reading, while page monitors watch whole pages. Neither gives a small, portable answer to “is this exact passage still what I saw?”

## Innovation hypothesis

If a user can turn one selected passage into a portable local pin and verify it later with one selection, they will use it for claims, research notes, policy references, and important web instructions because the result is immediate and inspectable.

## What is different

PassagePin is not a quote library or an always-on monitor. It is a user-invoked, one-passage integrity primitive: normalized selected text gets a SHA-256 digest, the URL is reduced to origin/path, and the result is sealed in plain JSON. The user can keep only the digest, or explicitly opt in to storing the quote locally for citation.

## MVP flow

1. The user selects a passage in the current browser tab.
2. The user explicitly clicks the PassagePin toolbar action.
3. The panel shows only selection length and word count. The user may check “Store quote in file for local citation”.
4. The user clicks “Create pin” and downloads `passagepin-*.json`.
5. Later, the user selects the passage on the page again, loads the pin file into the panel, and clicks “Verify selected passage”.
6. PassagePin reports `EXACT`, `CHANGED`, or `MISSING`; it never sends the selection or pin to a server.

## Privacy and safety boundaries

- No account, AI, cloud, analytics, background scanning, or network request.
- Only the active tab is inspected after explicit toolbar invocation.
- Raw quote text is opt-in and stays in the downloaded local file; default pins contain only a digest, length, and word count.
- URL query strings and fragments are removed.
- Verification requires a user-selected local JSON file and a user-selected current passage.
- The extension does not edit pages, block navigation, or monitor in the background.
- A pin proves equality with the user’s later selection, not authorship, legal admissibility, or server truth.

## Seven-day experiment

Give the extension to ten people who save web evidence. Ask each to pin one passage, change the page fixture, and verify it later. Measure whether they understand the three outcomes without explanation and whether at least three say it is more useful than a screenshot or ordinary bookmark.

## Non-goals for v0.1.0

- Automatic page monitoring or notifications.
- OCR, AI summaries, citation style generation, or cloud sync.
- Claims that a page is authentic or that a source is truthful.
- Whole-page archival or raw browsing-history capture.
