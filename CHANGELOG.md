# Changelog

Notable project changes are recorded here. The v2.1.0 release is now public with a downloadable ZIP asset.

## Unreleased

- Initial public GitHub project setup and user documentation.
- The V2.1 extension source (`content.js`, `manifest.json`, `popup.html`, `icon.png`) is committed to `main` and the official [v2.1.0 release](../../releases/tag/v2.1.0) includes the installable ZIP.
- Known issue to resolve before release: attempted shift additions can be counted as successful without authoritative confirmation from the site.

## 2.1.0 — Published November 7, 2026

- Watches the Shift Finder DOM for available action buttons.
- Supports automatic confirmation and attempts to dismiss the final **Done** popup.
- Returns to watching after processing a group of detected shifts.
- Adds theme, optional sound/notifications, local history, JSON export, and keyboard shortcuts.
- Uses local settings storage and auto-start/resume behavior.

**Note:** v2.1.0 is an official public GitHub Release, but release packaging tests do not verify operation against the live Amazon website.
