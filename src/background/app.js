/* eslint-disable consistent-return */
const url = require('url');
const path = require('path');
const browser = require('webextension-polyfill');
const { UrlParser } = require('./util');

// Respond to requests to redirect a tab
const redirectTab = async (request) => {
  // Redirect tab page (when file node is clicked)
  if (request.action === 'redirect') {
    const {
      payload: { window, base, filepath, openInNewTab }
    } = request;
    // Open a new tab
    if (openInNewTab) {
      try {
        await browser.tabs.create({
          windowId: window.windowId,
          url: url.resolve('https://github.com/', path.join(base, filepath)),
          active: false
        });
      } catch (error) {
        console.error('Error creating tab', error);
      }
    }
    // Send redirect event to active tab
    else {
      try {
        // Instead of triggering a content script which is unreliable when it doesn't load
        // on the page correctly all the time. Inject listener and then send message
        await browser.tabs.executeScript(window.tabId, {
          file: 'background.redirect.inject.js'
        });

        await browser.tabs.sendMessage(window.tabId, {
          action: 'redirect-content-script',
          payload: request.payload
        });
      } catch (error) {
        console.error('Error redirecting active tab', error);
      }
    }
    return null;
  }

  // Redirect url (when url is provided)
  if (request.action === 'redirect-to-url') {
    const {
      payload: { url: redirectUrl }
    } = request;
    try {
      // Open a new tab
      await browser.tabs.create({
        // windowId: window.windowId, // defaults to the last current window
        url: redirectUrl,
        active: false
      });
    } catch (error) {
      console.error('Error redirecting to url', error);
    }
    return null;
  }

  // Change active tab (when branch node is clicked)
  if (request.action === 'change-active-tab') {
    try {
      const tab = await browser.tabs.get(request.payload.destinationTabId);
      // Focus tab's window
      await browser.windows.update(tab.windowId, { focused: true });

      await browser.tabs.update(tab.id, { active: true }); // Activate tab
      // Keep popup focused
      const { currentWindowId } = await browser.storage.sync.get([
        'currentWindowId'
      ]);
      browser.windows.update(currentWindowId, { focused: true });

      // Send active-tab-changed action to set current branch
      const parsed = new UrlParser(tab.url, tab.title, tab.id).parse();
      await browser.runtime.sendMessage({
        action: 'active-tab-changed',
        payload: {
          ...parsed,
          isGithubRepoUrl: Object.keys(parsed).length !== 0,
          windowId: tab.windowId,
          tabId: tab.id
        }
      });
      // To let frontend know when tab updates have been made.
      return { action: 'change-active-tab', complete: true };
    } catch (error) {
      console.error('Error changing active tab', error);
    }
    return null;
  }

  // Get open repository files by scanning all open tabs
  // Expensive so don't call this often
  if (request.action === 'get-open-repositories') {
    try {
      const windows = await browser.windows.getAll({
        windowTypes: ['normal'],
        populate: true
      });

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

      return {
        action: 'get-open-repositories',
        payload: openRepositories
      };
    } catch (error) {
      console.error('Error getting all windows', error);
    }
    return null;
  }
  return null;
};
browser.runtime.onMessage.addListener((request) => {
  if (
    [
      'redirect',
      'redirect-to-url',
      'change-active-tab',
      'get-open-repositories'
    ].includes(request.action)
  ) {
    return redirectTab(request);
  }
});

// When github tab states are updated when windows or tabs closed.
// eslint-disable-next-line prefer-const
let tabIdsToCreate = new Set();
// eslint-disable-next-line prefer-const
let tabIdsToRemoveToTab = {};
// Add initially open tabs to tabIdsToRemoveToTab in case they are removed
const initializeOpenTabs = async () => {
  try {
    const windows = await browser.windows.getAll({
      windowTypes: ['normal'],
      populate: true
    });
    windows.forEach(({ tabs }) => {
      tabs.forEach(({ id, url: tabUrl, title }) => {
        tabIdsToRemoveToTab[id] = { id, tabUrl, title };
      });
    });
  } catch (error) {
    console.error('Error initializing open tabs', error);
  }
};
initializeOpenTabs();

const sendOpenRepositoryUpdatesMessage = async () => {
  try {
    const windows = await browser.windows.getAll({
      windowTypes: ['normal'],
      populate: true
    });
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
    browser.runtime.sendMessage({
      action: 'tab-updated',
      payload: openRepositories
    });
  } catch (error) {
    console.error('Error updating open repositories', error);
  }
};

const initializeTabListeners = () => {
  browser.tabs.onCreated.addListener((tab) => {
    tabIdsToCreate.add(tab.id);
  });
  browser.tabs.onRemoved.addListener(() => {
    sendOpenRepositoryUpdatesMessage();
  });
  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    sendOpenRepositoryUpdatesMessage();
    // Also send active tab change event so that current branch & window/tab
    // can be updated on frontend
    if (tab.active && changeInfo.url) {
      const parsed = new UrlParser(tab.url, tab.title, tabId).parse();
      browser.runtime.sendMessage({
        action: 'active-tab-changed',
        payload: {
          ...parsed,
          isGithubRepoUrl: Object.keys(parsed).length !== 0,
          windowId: tab.windowId,
          tabId
        }
      });
    }
  });
};
initializeTabListeners();
