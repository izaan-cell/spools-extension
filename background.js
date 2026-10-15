// Chromium (MV3 service worker) has no "browser" global and can't load a
// second background script via the manifest, so it pulls the polyfill in
// here. Firefox already lists browser-polyfill.js first in its manifest and
// has a native "browser" global anyway, so this is a no-op there.
if (typeof importScripts === "function" && typeof browser === "undefined") {
  importScripts("browser-polyfill.js");
}

const API_BASE = "https://api.spools.studio";
const SITE_BASE = "https://spools.studio";
const MENU_ID = "upload-to-spools";

const CATEGORY_BY_EXT = {
  jpg: "image",
  jpeg: "image",
  png: "image",
  webp: "image",
  gif: "gif",
  mp4: "video",
  mov: "video"
};

browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: MENU_ID,
    title: "Upload to Spools",
    contexts: ["image", "video"]
  });
});

browser.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === MENU_ID) {
    handleUpload(info.srcUrl).catch((err) => {
      console.error("Spools upload failed:", err);
      notify("Upload failed", err.message || String(err));
    });
  }
});

async function handleUpload(srcUrl) {
  const { apiToken } = await browser.storage.local.get("apiToken");
  if (!apiToken) {
    browser.runtime.openOptionsPage();
    return;
  }

  const filename = filenameFromUrl(srcUrl);
  const ext = filename.split(".").pop().toLowerCase();
  const category = CATEGORY_BY_EXT[ext];
  if (!category) {
    notify("Unsupported file type", `.${ext} isn't an image, gif, or video Spools accepts.`);
    return;
  }

  const fileResp = await fetch(srcUrl);
  if (!fileResp.ok) throw new Error(`Couldn't fetch the file (${fileResp.status}).`);
  const blob = await fileResp.blob();
  const contentType = blob.type || `application/octet-stream`;

  const presign = await apiCall(apiToken, {
    action: "presign",
    filename,
    contentType,
    size: blob.size,
    category
  });

  const putResp = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: blob
  });
  if (!putResp.ok) throw new Error(`Upload to storage failed (${putResp.status}).`);

  const confirm = await apiCall(apiToken, {
    action: "confirm",
    key: presign.key,
    filename,
    contentType,
    size: blob.size,
    category,
    isPublic: true,
    description: ""
  });

  const shareUrl = SITE_BASE + confirm.url;
  await copyToClipboard(shareUrl);

  const { redirectOnUpload } = await browser.storage.local.get("redirectOnUpload");
  if (redirectOnUpload !== false) {
    const verified = await verifyUploaded(presign.key, apiToken);
    if (verified) {
      await browser.tabs.create({ url: `${shareUrl}?via=extension` });
      return;
    }
  }

  notify("Uploaded to Spools", `Link copied to clipboard: ${shareUrl}`);
}

// Confirm already recorded the upload server-side by the time it returns,
// but we re-check before redirecting the user so they never land on a page
// that isn't there yet instead of silently redirecting to a dead link.
async function verifyUploaded(key, token) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const resp = await fetch(`${API_BASE}/media-info?key=${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resp.ok) return true;
    } catch {
      // network hiccup - fall through to retry
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  return false;
}

async function apiCall(token, body) {
  const resp = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    throw new Error(data.error || `Spools returned an error (${resp.status}).`);
  }
  return data;
}

function filenameFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const base = pathname.substring(pathname.lastIndexOf("/") + 1);
    return decodeURIComponent(base) || "upload";
  } catch {
    return "upload";
  }
}

async function copyToClipboard(text) {
  // MV3 service workers can't touch navigator.clipboard directly - route
  // through a short-lived offscreen document. Firefox's background script
  // isn't a service worker, so it can write to the clipboard directly.
  if (typeof browser.offscreen === "undefined") {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard access denied - the notification still shows the link.
    }
    return;
  }

  const hasDoc = await browser.offscreen.hasDocument();
  if (!hasDoc) {
    await browser.offscreen.createDocument({
      url: "offscreen.html",
      reasons: ["CLIPBOARD"],
      justification: "Copy the uploaded file's share link to the clipboard."
    });
  }
  await browser.runtime.sendMessage({ type: "copy-to-clipboard", text });
}

function notify(title, message) {
  browser.notifications.create({
    type: "basic",
    iconUrl: "icons/icon128.png",
    title,
    message
  });
}
