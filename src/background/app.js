/* global chrome */
const url = require('url');
const path = require('path');
const { UrlParser } = require('./util');

// Respond to requests to redirect a tab
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Redirect tab page (when file node is clicked)
  if (request.action === 'redirect') {
    console.log(request);
    const {
      payload: { window, base, filepath, openInNewTab }
    } = request;
    // Open a new tab
    if (openInNewTab) {
      chrome.tabs.create({
        windowId: window.windowId,
        url: url.resolve('https://github.com/', path.join(base, filepath)),
        active: false
      });
    }
    // Send redirect event to active tab
    else {
      // Instead of triggering a content script which is unreliable when it doesn't load
      // on the page correctly all the time. Inject listener and then send message
      chrome.tabs.executeScript(
        window.tabId,
        { file: 'background.redirect.inject.js' },
        () => {
          chrome.tabs.sendMessage(window.tabId, {
            action: 'redirect-content-script',
            payload: request.payload
          });
        }
      );
    }

    sendResponse();
  }

  // Change active tab (when branch node is clicked)
  else if (request.action === 'change-active-tab') {
    chrome.tabs.get(request.payload.destinationTabId, (tab) => {
      // Activate tab
      chrome.tabs.update(tab.id, { active: true });
      // Draw attention to window
      // chrome.windows.update(tab.windowId, { drawAttention: true });
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
            const parsed = new UrlParser(tabUrl, tabTitle, tabId).parse();
            console.log('PARSED', parsed);
            if (Object.keys(parsed).length !== 0) {
              const { owner, repo } = parsed;
              const currentRepoData = openRepositories[`${owner}/${repo}`];
              openRepositories[`${owner}/${repo}`] = [
                ...(currentRepoData || []),
                parsed
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
// Add initially open tabs to tabIdsToRemoveToTab in case they are removed
chrome.windows.getAll(
  { windowTypes: ['normal'], populate: true },
  (windows) => {
    windows.forEach(({ tabs }) => {
      tabs.forEach(({ id, url: tabUrl, title }) => {
        tabIdsToRemoveToTab[id] = { id, tabUrl, title };
      });
    });
  }
);

// const sendOpenRepositoryUpdatesMessage = (
//   { id, url: tabUrl, title },
//   status
// ) => {
//   const isGRUrl = isGithubRepoUrl(tabUrl);
//   const parsedRepoInfo = parseUrl(tabUrl, title, id);
//   if (!isGRUrl || !parsedRepoInfo) {
//     return;
//   }
//   const { owner, repo } = parsedRepoInfo;
//   chrome.runtime.sendMessage({
//     action: 'tab-updated',
//     payload: {
//       key: `${owner}/${repo}`,
//       status,
//       repo: parsedRepoInfo
//     }
//   });
// };

const sendOpenRepositoryUpdatesMessage = () => {
  chrome.windows.getAll(
    { windowTypes: ['normal'], populate: true },
    (windows) => {
      // eslint-disable-next-line prefer-const
      let openRepositories = {}; // <key: repo, value: [<files>]>

      windows.forEach(({ tabs }) => {
        tabs.forEach(({ id: tabId, url: tabUrl, title: tabTitle }) => {
          const parsed = new UrlParser(tabUrl, tabTitle, tabId).parse();
          if (Object.keys(parsed).length !== 0) {
            const { owner, repo } = parsed;
            const currentRepoData = openRepositories[`${owner}/${repo}`];
            openRepositories[`${owner}/${repo}`] = [
              ...(currentRepoData || []),
              parsed
            ];
          }
        });
      });
      console.log('Sending tab updated', openRepositories);
      chrome.runtime.sendMessage({
        action: 'tab-updated',
        payload: openRepositories
      });
    }
  );
};

chrome.tabs.onCreated.addListener((tab) => {
  tabIdsToCreate.add(tab.id);
});
chrome.tabs.onRemoved.addListener(() => {
  sendOpenRepositoryUpdatesMessage();
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(changeInfo);
  sendOpenRepositoryUpdatesMessage();
  // Also send active tab change event so that current branch & window/tab
  // can be updated on frontend
  if (tab.active && changeInfo.url) {
    const parsed = new UrlParser(tab.url, tab.title, tabId).parse();
    chrome.runtime.sendMessage({
      action: 'active-tab-changed',
      payload: {
        ...parsed,
        isGithubRepoUrl: Object.keys(parsed).length !== 0,
        windowId: tab.windowId,
        tabId
      }
    });
  }
  // if (changeInfo.status === 'complete') {
  //   // Create or Update once tab is loaded
  //   if (tabIdsToCreate.has(tabId)) {
  //     // Create
  //     sendOpenRepositoryUpdatesMessage(tab, 'create');
  //     // If tab with url to be updated is the active tab, also send a 'active-tab-changed' message
  //     if (tab.active) {
  //       const isGRUrl = isGithubRepoUrl(tab.url);
  //       chrome.runtime.sendMessage({
  //         action: 'active-tab-changed',
  //         payload: {
  //           ...(isGRUrl && parseUrl(tab.url, tab.title, tabId)),
  //           isGithubRepoUrl: isGRUrl,
  //           windowId: tab.windowId,
  //           tabId
  //         }
  //       });
  //     }
  //     // Cleanup
  //     tabIdsToCreate.delete(tabId);
  //   }
  // }
  // // Add to update queue while tabs are loading
  // else if (changeInfo.url) {
  //   if (
  //     tabIdsToRemoveToTab[tabId] &&
  //     tab.url !== tabIdsToRemoveToTab[tabId].url
  //   ) {
  //     sendOpenRepositoryUpdatesMessage(tabIdsToRemoveToTab[tabId], 'remove');
  //   }
  //   tabIdsToCreate.add(tabId);
  // }

  // tabIdsToRemoveToTab[tabId] = { id: tabId, url: tab.url, title: tab.title };
});
