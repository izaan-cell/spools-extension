# Store listing copy

Use this for Edge Add-ons, Opera Add-ons, and Firefox AMO — the fields differ slightly in name per store, but this covers all of them.

## Short description (≤132 chars, Edge/Firefox both cap around here)

Right-click any image or video on the web and upload it straight to your Spools account.

## Detailed description

Spools Uploader adds one item to your right-click menu: **Upload to Spools**. Click it on any image or video and it's uploaded to your Spools (spools.studio) account in a couple seconds — the share link is copied to your clipboard automatically, ready to paste.

Requires a free [Spools](https://spools.studio) account on an Amber tier or above, and a personal API token (generate one from your dashboard's API tab — the extension's Settings page links straight there).

**What it does:**
- Adds "Upload to Spools" to the right-click menu on images and videos
- Uploads the file using your personal Spools API token
- Copies the resulting share link to your clipboard
- Shows a notification when the upload finishes (or if something goes wrong — size limit, bad token, etc.)

**What it doesn't do:**
- Doesn't read or collect any browsing data beyond the specific image/video you choose to upload
- Doesn't send anything anywhere except api.spools.studio

## Category

Productivity / Tools (store-specific category pickers vary; pick whichever is closest to "productivity" or "photo/file tools")

## Privacy policy URL

https://spools.studio/privacy

## Support / homepage URL

https://spools.studio/contact

## Permissions justification (stores ask for this)

- `contextMenus` — adds the "Upload to Spools" right-click item
- `storage` — stores your API token locally so you don't re-enter it every time
- `notifications` — shows the upload-succeeded / upload-failed toast
- `offscreen` (Chromium only) — required by Manifest V3 to copy the share link to your clipboard from a background service worker
- `host_permissions: api.spools.studio` — the only server this extension talks to

## Icon / screenshots

Icons are in `icons/` (128px is the one stores typically want for the listing itself). Screenshots need to be taken from the real, loaded extension — a right-click menu showing "Upload to Spools", and the success notification — once it's installed and tested; these can't be faked ahead of time.
