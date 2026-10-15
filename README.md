# Spools Uploader

A browser extension: right-click any image or video on the web and upload it straight to your [Spools](https://spools.studio) account. The share link is copied to your clipboard automatically, and (unless you turn it off in Settings) a new tab opens showing the uploaded file once it's confirmed live.

Requires a personal API token from an Amber+ Spools account — create one at [spools.studio/dashboard/api](https://spools.studio/dashboard/api).

## Install

This isn't on any browser's official store yet, so every browser installs it the same way — as an unpacked/temporary extension from source. It's a couple of clicks, no payment or account needed anywhere.

### 1. Get the code and build it

```bash
git clone https://github.com/izaan-cell/spools-extension.git
cd spools-extension
./build.sh
```

This produces `dist/chromium` (for Chrome, Brave, Edge, and Opera — they all share one Chromium build) and `dist/firefox`.

### 2. Load it into your browser

**Chrome / Brave / Edge / Opera:**
1. Go to `chrome://extensions` (`brave://extensions`, `edge://extensions`, or `opera://extensions`).
2. Turn on **Developer mode** (top right on Chrome/Brave/Edge; it's already on by default on Opera's page).
3. Click **Load unpacked** and select the `dist/chromium` folder.

**Firefox:**
1. Go to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on**.
3. Select `dist/firefox/manifest.json`.
4. Note: Firefox removes temporary add-ons when it restarts — that's a Firefox limitation on unsigned extensions, not something this project controls. It'll need reloading after a browser restart until it's published on addons.mozilla.org.

## Enable and set up

1. After loading it, click the extension's icon in your toolbar (pin it first via the puzzle-piece icon if you don't see it) and click **Settings**, or right-click the extension icon → **Options**.
2. Paste a Spools API token (starts with `spt_`) — get one from [spools.studio/dashboard/api](https://spools.studio/dashboard/api). This is an Amber+ feature, so you'll need a paid Spools tier to create a token.
3. Leave **"Open the upload in a new tab after it finishes"** checked if you want to land on the share page automatically, or uncheck it if you'd rather just get the clipboard link + a notification.
4. Click **Save**.

## Use it

Right-click any image or video on a webpage → **Upload to Spools**. That's it. Within a couple seconds:
- The file is uploaded to your Spools account.
- The share link is copied to your clipboard.
- A new tab opens to the share page (unless you turned that off in Settings).

If something's wrong — no token saved, the file's too big for your tier, an unsupported file type — you get a notification explaining what happened instead of a silent failure.

## Updating

Since this isn't auto-updating from a store yet, pull the latest code and rebuild:

```bash
git pull
./build.sh
```

Then go back to your browser's extensions page and click the reload icon on the Spools Uploader card (Firefox: reload the temporary add-on the same way you loaded it). Your saved token and settings are preserved across reloads.

## Development

```bash
./build.sh
```

Builds `dist/chromium` and `dist/firefox` from the shared source files (`background.js`, `options.html`/`.js`, `popup.html`/`.js`) plus each platform's own `manifest.*.json`, and zips both for distribution. See [STORE_LISTING.md](STORE_LISTING.md) for the copy prepared for Edge/Opera/Firefox store submissions once those are ready.

## Privacy

The extension only talks to `api.spools.studio`. Your API token and settings are stored in the browser's own local extension storage — never synced anywhere, never sent anywhere but Spools. See [spools.studio/privacy](https://spools.studio/privacy).
