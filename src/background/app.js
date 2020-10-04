/* global chrome */
const { parseUrl, isGithubRepoUrl } = require('./util');

// Respond to requests to redirect a tab
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Redirect tab page (when file node is clicked)
  if (request.action === 'redirect') {
    chrome.tabs.sendMessage(request.payload.window.tabId, {
      action: 'redirect-content-script',
      payload: request.payload
    });

    sendResponse();
  }

  // Change active tab (when branch node is clicked)
  else if (request.action === 'change-active-tab') {
    chrome.tabs.get(request.payload.destinationTabId, (tab) => {
      // Activate tab
      chrome.tabs.update(tab.id, { active: true });
      // Activate window
      // chrome.windows.update(tab.windowId, { focused: true });
    });
  }

  // Get open repository files by scanning all open tabs
  // Expensive so don't call this often
  else if (request.action === 'get-open-repositories') {
    chrome.windows.getAll(
      { windowTypes: ['normal'], populate: true },
      (windows) => {
        // eslint-disable-next-line prefer-const
        let openRepositories = {}; // <key: repo, value: [<files>]>

        windows.forEach(({ tabs }) => {
          tabs.forEach(({ id: tabId, url: tabUrl, title: tabTitle }) => {
            const parsedRepoInfo = parseUrl(tabUrl, tabTitle, tabId);
            if (parsedRepoInfo) {
              const { owner, repo } = parsedRepoInfo;
              const currentRepoData = openRepositories[`${owner}/${repo}`];
              openRepositories[`${owner}/${repo}`] = [
                ...(currentRepoData || []),
                parsedRepoInfo
              ];
            }
          });
        });

        sendResponse({
          action: 'get-open-repositories',
          payload: openRepositories
        });
      }
    );
  }

  return true; // necessary to indicate content script to wait for async
});

// When github tab states are updated when windows or tabs closed.
// eslint-disable-next-line prefer-const
let tabIdsToCreate = new Set();
// eslint-disable-next-line prefer-const
let tabIdsToRemoveToTab = {};

const sendOpenRepositoryUpdatesMessage = ({ id, url, title }, status) => {
  const isGRUrl = isGithubRepoUrl(url);
  const parsedRepoInfo = parseUrl(url, title, id);
  if (!isGRUrl || !parsedRepoInfo) {
    return;
  }
  const { owner, repo } = parsedRepoInfo;
  chrome.runtime.sendMessage({
    action: 'tab-updated',
    payload: {
      key: `${owner}/${repo}`,
      status,
      repo: parsedRepoInfo
    }
  });
};
chrome.tabs.onCreated.addListener((tab) => {
  tabIdsToCreate.add(tab.id);
});
chrome.tabs.onRemoved.addListener((tabId) => {
  // Remove
  if (tabIdsToRemoveToTab[tabId]) {
    sendOpenRepositoryUpdatesMessage(tabIdsToRemoveToTab[tabId], 'remove');
  }
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // Create or Update once tab is loaded
    if (tabIdsToCreate.has(tabId)) {
      // Create
      sendOpenRepositoryUpdatesMessage(tab, 'create');
      // If tab with url to be updated is the active tab, also send a 'active-tab-changed' message
      if (tab.active) {
        const isGRUrl = isGithubRepoUrl(tab.url);
        chrome.runtime.sendMessage({
          action: 'active-tab-changed',
          payload: {
            ...(isGRUrl && parseUrl(tab.url, tab.title, tabId)),
            isGithubRepoUrl: isGRUrl,
            windowId: tab.windowId,
            tabId
          }
        });
      }
      // Cleanup
      tabIdsToCreate.delete(tabId);
    }
  }
  // Add to update queue while tabs are loading
  else if (changeInfo.url) {
    if (
      tabIdsToRemoveToTab[tabId] &&
      tab.url !== tabIdsToRemoveToTab[tabId].url
    ) {
      sendOpenRepositoryUpdatesMessage(tabIdsToRemoveToTab[tabId], 'remove');
    }
    tabIdsToCreate.add(tabId);
  }

  tabIdsToRemoveToTab[tabId] = { id: tabId, url: tab.url, title: tab.title };
});
