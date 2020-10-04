/* global chrome */

export const redirectTo = (base, filepath, currentWindowTab) => {
  chrome.runtime.sendMessage({
    action: 'redirect',
    payload: { window: currentWindowTab, base, filepath }
  });
};

export const changeActiveTab = (destinationTabId) => {
  chrome.runtime.sendMessage({
    action: 'change-active-tab',
    payload: { destinationTabId }
  });
};
