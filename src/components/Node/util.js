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

export const parseFilePath = (filePath) => {
  if (!filePath) return { parentPath: null, fileName: null };
  const parsed = filePath.split('/');
  const parentPath = parsed.slice(0, -1).join('/');
  const fileName = parsed.slice(-1);
  return { parentPath, fileName };
};
