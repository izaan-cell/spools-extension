# Spools Uploader

A browser extension: right-click any image or video on the web and upload it straight to your [Spools](https://spools.studio) account. The share link gets copied to your clipboard automatically.

Requires a personal API token from an Amber+ account — create one at [spools.studio/dashboard/api](https://spools.studio/dashboard/api), then paste it into the extension's Settings page the first time you use it.

## Install

### Chrome / Brave (sideload, free, no store listing)

1. Download and unzip [`spools-uploader-chromium.zip`](dist/spools-uploader-chromium.zip) (or use the `dist/chromium` folder directly if you have this repo checked out).
2. Go to `chrome://extensions` (or `brave://extensions` in Brave).
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the unzipped `chromium` folder.
5. Pin it from the puzzle-piece icon in the toolbar if you want quick access to Settings.

### Edge

Once published: install from Edge Add-ons (link TBD after submission). Until then, same sideload steps as Chrome above work in Edge too (`edge://extensions`, Developer mode, Load unpacked).

### Opera

Once published: install from Opera Add-ons (link TBD after submission). Until then, `opera://extensions`, Developer mode, Load unpacked, same `dist/chromium` folder.

### Firefox

Once published: install from addons.mozilla.org (link TBD after submission). To try it now: go to `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on**, and select `dist/firefox/manifest.json`. (Temporary add-ons are removed when Firefox restarts — that's a Firefox limitation, not ours; a real AMO install doesn't have this issue.)

## Development

```
./build.sh
```

Builds `dist/chromium` and `dist/firefox` from the shared source files plus each platform's manifest, and zips both for distribution.

## Privacy

The extension only talks to `api.spools.studio`. Your API token is stored in the browser's own sync storage (Chrome/Firefox account sync, not sent anywhere but Spools). See [spools.studio/privacy](https://spools.studio/privacy).
