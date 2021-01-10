# Privacy

We take privacy very seriously. **Chummy does NOT and will NEVER track, store, or sell your private information in any shape or form.**

When installing this extension for the first time, you will be asked to grant the extension the ability to "Read your browsing history." In the name of upmost transparency, we've put together a breakdown of exactly how your information is being used in this extension.

## Permissions

The extension's `manifest.json` (see [here](https://github.com/alexkim205/tomaso) in our repository) requests access to two permissions (`tabs` and `storage`) and a hosts permission to `github.com`

### `tabs`

- Interact with open Github tabs so that the user can manage them from a separate window.
- Open a new tab in the active window during user sign in.

### `storage`

- Save user settings (i.e., ui settings, browser window, and other non sensitive information) in the browser's storage.

### `host`

- Access information about Github webpages (`*://github.com/*`) and Chummy's user sign-in flow webpage (`https://chummy.atomiccode.io/account`).

You don't have to worry about this list growing much even as new features are added because these two permissions encompass the main functionality of the extension already. If on the rare occasion we do request additional permissions in the future, you'll hear it from us first!

## Transparency

All of Chummy's source code is open sourced on Github and we perform regular security audits. If you spot a security risk, we do ask that you send an email to chummy@atomiccode.io per our [Security Policy](https://github.com/alexkim205/chummy/blob/extension/SECURITY.md).
