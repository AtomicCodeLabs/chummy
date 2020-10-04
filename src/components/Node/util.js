/* global chrome */

export const redirectTo = (
  base,
  filepath,
  currentWindowTab,
  openInNewTab = false
) => {
  chrome.runtime.sendMessage({
    action: 'redirect',
    payload: { window: currentWindowTab, base, filepath, openInNewTab }
  });
};

export const changeActiveTab = (destinationTabId) => {
  chrome.runtime.sendMessage({
    action: 'change-active-tab',
    payload: { destinationTabId }
  });
};
