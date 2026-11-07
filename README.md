# V2 Sniper — Amazon A to Z Shift Grabber

> **Independent, unofficial Chrome extension. Not affiliated with, sponsored by, or endorsed by Amazon.**

V2 Sniper is a personal browser automation project for monitoring the Amazon A to Z Shift Finder webpage and attempting to select available shifts. It uses an on-page control panel and interacts with visible webpage controls; it does **not** guarantee a shift will be added.

## Project status

**Pre-release — no downloadable GitHub release is available yet.**

The source files and a tested release ZIP must be added before anyone can install V2 Sniper from this repository. Please do not mistake GitHub's **Code → Download ZIP** for an installable extension until the extension files are present.

## Features in the reviewed local V2.1 build

- Shift Finder page watcher using `MutationObserver`
- Automatic interaction with “Add Shift,” confirmation, and “Done” controls
- Session prompt handling
- On-page Watch / Stop controls
- Auto-start option and same-tab resume after refresh
- Light and dark UI themes
- Optional desktop notifications and success sound
- Local settings, recent attempt history, and JSON log export
- Keyboard shortcuts: **Alt+W** (watch), **Alt+S** (stop), **Alt+E** (export)

> **Accuracy warning:** The reviewed V2.1 build can classify an attempt as successful without a verified server-side confirmation. Its success counter and notifications must not be treated as proof that a shift was added. Confirm any shift in your official schedule.

## Installation (after the extension files are published)

1. Download a packaged release from the [Releases page](../../releases), or download the source folder containing `manifest.json`, `content.js`, `popup.html`, and `icon.png`.
2. If downloaded as a ZIP, extract it.
3. On **desktop Google Chrome**, open `chrome://extensions`.
4. Enable **Developer mode**.
5. Choose **Load unpacked** and select the folder containing `manifest.json`.
6. Open Amazon A to Z's Shift Finder in Chrome. The V2 Sniper panel should appear on the supported page.

Chrome for iOS and Android does not support loading this desktop Chrome extension.

## Usage

Open Shift Finder, review the settings in the V2 Sniper panel, then click **Watch**. Click **Stop** to stop monitoring. Always confirm the final result in Amazon A to Z itself; the extension may miss state changes, process an unavailable shift, or misinterpret page messages.

## Compatibility and limitations

- Designed for the desktop A to Z Shift Finder URL `https://atoz.amazon.work/shifts/schedule/find`.
- Depends on visible buttons and page text. Website updates can break detection or cause unexpected clicks.
- Availability is not guaranteed; shifts can be taken by other users at any time.
- The reviewed local V2.1 implementation has known reliability issues with success detection and broad text matching.
- The “stay logged in” interaction is automated; this behavior may not be suitable or permitted in all environments.

## Privacy and permissions

The reviewed local V2.1 source uses Chrome's **storage** and **notifications** permissions and declares access to `atoz.amazon.work`. Settings and recent history are stored using `chrome.storage.local`. No external analytics service or credential collection was found in the reviewed files. Future releases should be reviewed individually; do not share account passwords, cookies, or exported logs containing personal information.

## Responsible use

Before installing or distributing this tool, check Amazon's applicable policies and the platform's terms. Automation on a workforce scheduling system may be restricted, and the extension does not bypass those rules. Use at your own discretion.

## Feedback and contributions

Use [Issues](../../issues) for reproducible bug reports and improvement ideas. **Do not post Amazon account credentials, employee IDs, personal schedules, cookies, or private company information.** See [CONTRIBUTING.md](CONTRIBUTING.md) for reporting guidance.

## License

No license has been selected yet. Public source visibility alone does **not** grant permission to reuse, modify, or redistribute code. A license should be chosen before accepting outside contributions or encouraging redistribution.
