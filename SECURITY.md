# Security policy

## Scope

PassagePin is a local Chrome extension, demo, and offline verifier. Its main security promise is data minimization: the default pin contains no raw quote text.

## Report a vulnerability

Do not open a public issue for a suspected privacy or security vulnerability. Use GitHub’s private security advisory flow for this repository, or contact the owner privately through GitHub with a synthetic reproduction.

Never include real private passages, credentials, tokens, or authenticated URLs in a report.

## Design promises

- No network, analytics, telemetry, account, or background monitoring path.
- Only the explicitly invoked active tab is inspected.
- Raw quote text requires an explicit opt-in checkbox and stays in the local file.
- Query strings and URL fragments are removed.
- Verification requires a user-selected file and user-selected passage.
- Tampered pin metadata fails integrity verification before comparison.

## Limitations

SHA-256 proves equality of normalized input; it does not make a short or guessable passage secret. A pin can be deleted or copied by the operating system. `EXACT` is not a statement that the passage is true or that the page is authentic.
