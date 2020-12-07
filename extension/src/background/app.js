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
        const newTab = {
          windowId: window.windowId,
          url: url.resolve('https://github.com/', path.join(base, filepath)),
          active: false
        };
        await browser.tabs.create(newTab);
      } catch (error) {
        console.warn('Error creating tab', error);
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

        const response = {
          action: 'redirect-content-script',
          payload: request.payload
        };
        console.log('app.js', response);
        await browser.tabs.sendMessage(window.tabId, response);
      } catch (error) {
        console.warn('Error redirecting active tab', error);
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
      const newTab = {
        // windowId: window.windowId, // defaults to the last current window
        url: redirectUrl,
        active: true
      };
      await browser.tabs.create(newTab);
    } catch (error) {
      console.warn('Error redirecting to url', error);
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
      const response = {
        action: 'active-tab-changed',
        payload: {
          ...parsed,
          isGithubRepoUrl: Object.keys(parsed).length !== 0,
          windowId: tab.windowId,
          tabId: tab.id
        }
      };
      console.log('app.js', response);
      await browser.runtime.sendMessage(response);
      // To let frontend know when tab updates have been made.
      return { action: 'change-active-tab', complete: true };
    } catch (error) {
      console.warn('Error changing active tab', error);
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
      console.warn('Error getting all windows', error);
    }
    return null;
  }

  // Change active tab (when branch node is clicked)
  if (request.action === 'close-tab') {
    try {
      await browser.tabs.remove(request.payload.tabId);
      return { action: 'close-tab', complete: true };
    } catch (error) {
      console.warn('Error changing active tab', error);
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
      'get-open-repositories',
      'close-tab'
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
    console.warn('Error initializing open tabs', error);
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
    const response = {
      action: 'tab-updated',
      payload: openRepositories
    };
    console.log('app.js', response);
    browser.runtime.sendMessage(response);
  } catch (error) {
    console.warn('Error updating open repositories', error);
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
    const isTabTitleUrl = changeInfo.url === tab.title; // Tab changed event not ready to be sent
    if (tab.active && changeInfo.url && !isTabTitleUrl) {
      const parsed = new UrlParser(tab.url, tab.title, tabId).parse();
      const response = {
        action: 'active-tab-changed',
        payload: {
          ...parsed,
          isGithubRepoUrl: Object.keys(parsed).length !== 0,
          windowId: tab.windowId,
          tabId
        }
      };
      console.log('app.js', response);
      browser.runtime.sendMessage(response);
    }
  });
};
initializeTabListeners();
