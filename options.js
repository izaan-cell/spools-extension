const tokenInput = document.getElementById("token");
const status = document.getElementById("status");
const redirectCheckbox = document.getElementById("redirect");

browser.storage.local.get(["apiToken", "redirectOnUpload"]).then(({ apiToken, redirectOnUpload }) => {
  if (apiToken) tokenInput.value = apiToken;
  redirectCheckbox.checked = redirectOnUpload !== false;
});

document.getElementById("save").addEventListener("click", async () => {
  const value = tokenInput.value.trim();
  if (!value.startsWith("spt_")) {
    status.textContent = "That doesn't look like a Spools token (should start with spt_).";
    return;
  }
  await browser.storage.local.set({ apiToken: value, redirectOnUpload: redirectCheckbox.checked });
  status.textContent = "Saved.";
  setTimeout(() => (status.textContent = ""), 2000);
});
