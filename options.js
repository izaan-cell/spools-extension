const tokenInput = document.getElementById("token");
const status = document.getElementById("status");

browser.storage.local.get("apiToken").then(({ apiToken }) => {
  if (apiToken) tokenInput.value = apiToken;
});

document.getElementById("save").addEventListener("click", async () => {
  const value = tokenInput.value.trim();
  if (!value.startsWith("spt_")) {
    status.textContent = "That doesn't look like a Spools token (should start with spt_).";
    return;
  }
  await browser.storage.local.set({ apiToken: value });
  status.textContent = "Saved.";
  setTimeout(() => (status.textContent = ""), 2000);
});
