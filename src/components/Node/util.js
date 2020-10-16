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
  if (!filePath) return { parentPath: '', fileName: '/' };
  const parsed = filePath.split('/');
  const parentPath = parsed.slice(0, -1).join('/');
  const fileName = parsed.slice(-1);
  return { parentPath, fileName };
};

export const processTabInformation = (tab) => {
  const { subpage } = tab;
  if (subpage === 'repository') {
    const { parentPath, fileName } = parseFilePath(tab.nodeName);
    return {
      primaryText: decodeURI(fileName),
      secondaryText: parentPath,
      subpageText: tab.name // repo branch name
    };
  }
  if (subpage === 'issues' || subpage === 'pulls') {
    return {
      primaryText: tab.nodeName,
      secondaryText: tab.id,
      subpageText: subpage
    };
  }

  /* TODO
   * - actions
   * - projects
   * - wiki
   * - security
   * - pulse
   * - settings
   */

  return {
    primaryText: '/',
    secondaryText: '',
    subpageText: subpage
  };
};
