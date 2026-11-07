# Changelog

Notable project changes are recorded here. V2.1 source is now committed to the public repository; no separately packaged GitHub Release exists yet.

## Unreleased

- Initial public GitHub project setup and user documentation.
- V2.1 extension source (`content.js`, `manifest.json`, `popup.html`, `icon.png`) committed to the `main` branch; a GitHub Release asset has **not** yet been published.
- Known issue to resolve before release: attempted shift additions can be counted as successful without authoritative confirmation from the site.

## 2.1.0 — Source published to GitHub

- Watches the Shift Finder DOM for available action buttons.
- Supports automatic confirmation and attempts to dismiss the final **Done** popup.
- Returns to watching after processing a group of detected shifts.
- Adds theme, optional sound/notifications, local history, JSON export, and keyboard shortcuts.
- Uses local settings storage and auto-start/resume behavior.

**Note:** The 2.1.0 version number is read from the extension manifest. The publication of source does not imply external functional verification or a formal GitHub Release.
