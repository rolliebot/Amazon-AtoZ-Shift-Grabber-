# V2 Sniper v2.1.0

First public downloadable build of **V2 Sniper**, an independent Chrome extension for monitoring Amazon A to Z's desktop Shift Finder page.

## Features
- Watch for available shift actions and attempt to select them.
- Automated confirmation and dismissal of the final **Done** popup.
- Return to watching after an attempt.
- On-page Watch/Stop controls and activity logs.
- Optional desktop notifications, sound, dark/light themes, and auto-start.
- Local attempt history, JSON export, and keyboard shortcuts (**Alt+W**, **Alt+S**, **Alt+E**).

## Install
1. Under **Assets**, download **V2-Sniper-2.1.zip** (not the auto-generated source archives).
2. Extract it on a computer running desktop Chrome.
3. Open `chrome://extensions`, enable **Developer mode**, and select **Load unpacked**.
4. Choose the extracted `v2-sniper` folder containing `manifest.json`.
5. Open the A to Z Shift Finder page.

## Known limitations — read before using
- **Shift acceptance is not independently verified.** Some attempts may be counted as successful after a confirmation click even if the shift was not added. **Check your official A to Z schedule.**
- The extension depends on page content and button labels. Future website changes may interrupt operation.
- Automated shift selection and session handling may be restricted under employer policies or the service's terms. Verify authorization before use.
- This build has not been tested against the live Amazon website as part of this GitHub release process.

## Privacy and attribution
This is an independent, unofficial project and is **not affiliated with, endorsed by, or sponsored by Amazon**. It does not require sharing Amazon login credentials with the project. Do not upload personal schedules or session tokens in bug reports.

## Support
Report bugs in this repository's **Issues** section, after removing all personal and workplace-confidential information.
