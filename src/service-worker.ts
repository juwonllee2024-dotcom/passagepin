chrome.action.onClicked.addListener((tab) => {
  if (typeof tab.id !== "number") return;
  chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] }).catch(() => undefined);
});
