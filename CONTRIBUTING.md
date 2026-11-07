# Contributing to V2 Sniper

Thanks for helping improve this independent project.

## Before opening an issue

- Check whether the problem has already been reported.
- Include your V2 Sniper version, Chrome version, and the general action you were attempting.
- Describe expected versus actual behavior and steps to reproduce it.
- If a page update breaks selectors, describe the visible labels without sharing restricted employer data.

## Security and privacy

**Never post:** Amazon credentials, session cookies, authorization headers, employee identifiers, personal schedules, shift-specific private data, or internal company documents. Redact screenshots and logs before attaching them.

## Pull requests

- Prefer one focused change per pull request.
- Explain what changed and how it was tested.
- Avoid adding network endpoints, credential collection, analytics, or broader extension permissions without explicit review.
- Do not represent the project as approved by Amazon.
- Check relevant workplace and website policies before building or testing automation.

## Known reliability concern

The locally reviewed V2.1 code uses broad text matching when determining success and may report false positives. Fixes should require clear evidence of an accepted shift and distinguish **success**, **failure**, and **unverified** results.
