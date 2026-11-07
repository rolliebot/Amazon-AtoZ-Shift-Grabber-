# V2 Sniper — Amazon A to Z Shift Grabber

> **Independent, unofficial Chrome extension. Not affiliated with, sponsored by, or endorsed by Amazon.**

V2 Sniper is a personal browser automation project for monitoring the Amazon A to Z Shift Finder webpage and attempting to select available shifts. It uses an on-page control panel and interacts with visible webpage controls; it does **not** guarantee a shift will be added.

## Project status

**V2.1.0 is publicly released.** Download the installable ZIP from the [official v2.1.0 release](../../releases/tag/v2.1.0).

The release includes a packaged extension ZIP and its source files are also available in the repository. This build has not been independently tested in the current Amazon website environment.

## Features in the V2.1 source build

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

## Installation

1. Download **[V2-Sniper-2.1.zip](../../releases/download/v2.1.0/V2-Sniper-2.1.zip)** from the official [v2.1.0 release](../../releases/tag/v2.1.0), rather than the auto-generated source archive.
2. Extract the downloaded ZIP; it contains a `v2-sniper` folder with `manifest.json`, `content.js`, `popup.html`, and `icon.png`.
3. On **desktop Google Chrome**, open `chrome://extensions`.
4. Enable **Developer mode**.
5. Choose **Load unpacked** and select the extracted `v2-sniper` folder containing `manifest.json`.
6. Open Amazon A to Z's Shift Finder in Chrome. The V2 Sniper panel should appear on the supported page.

Chrome for iOS and Android does not support loading this desktop Chrome extension.

## Screenshots

These screenshots show the V2 Sniper interface on the Amazon A to Z Shift Finder page. **They were captured from the earlier V2.0 interface**, so some labels and behavior may differ from the published v2.1.0 package. Schedule-related information in the deployed screenshot has been redacted.

### Deployed on Amazon A to Z

![V2 Sniper overlay deployed on the Amazon A to Z Shift Finder page, with shift information redacted](assets/screenshots/deployed-overlay.png)

### Watching for available shifts

![V2 Sniper on-page control panel showing its active Watching state](assets/screenshots/watching-state.png)

## Usage

Open Shift Finder, review the settings in the V2 Sniper panel, then click **Watch**. Click **Stop** to stop monitoring. Always confirm the final result in Amazon A to Z itself; the extension may miss state changes, process an unavailable shift, or misinterpret page messages.

## Compatibility and limitations

- Designed for the desktop A to Z Shift Finder URL `https://atoz.amazon.work/shifts/schedule/find`.
- Depends on visible buttons and page text. Website updates can break detection or cause unexpected clicks.
- Availability is not guaranteed; shifts can be taken by other users at any time.
- The reviewed local V2.1 implementation has known reliability issues with success detection and broad text matching.
- The “stay logged in” interaction is automated; this behavior may not be suitable or permitted in all environments.

## Privacy and permissions

The V2.1 source uses Chrome's **storage** and **notifications** permissions and declares access to `atoz.amazon.work`. Settings and recent history are stored using `chrome.storage.local`. No external analytics service or credential collection was found in the reviewed files. Future releases should be reviewed individually; do not share account passwords, cookies, or exported logs containing personal information.

## Responsible use

Before installing or distributing this tool, check Amazon's applicable policies and the platform's terms. Automation on a workforce scheduling system may be restricted, and the extension does not bypass those rules. Use at your own discretion.

## Feedback and contributions

Use [Issues](../../issues) for reproducible bug reports and improvement ideas. **Do not post Amazon account credentials, employee IDs, personal schedules, cookies, or private company information.** See [CONTRIBUTING.md](CONTRIBUTING.md) for reporting guidance.

## License

No license has been selected yet. Public source visibility alone does **not** grant permission to reuse, modify, or redistribute code. A license should be chosen before accepting outside contributions or encouraging redistribution.
