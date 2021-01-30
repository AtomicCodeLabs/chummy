/* eslint-disable consistent-return */
import browser from 'webextension-polyfill';
import log from '../config/log';
import { resolveInjectJSFilenames, createGithubUrl } from './util';
import {
  getParsedOpenRepositories,
  sendActiveTabChanged
} from './url-parser.util';

// Respond to requests to redirect a tab
const redirectTab = async (request) => {
  // Redirect tab page (when file node is clicked)
  if (request.action === 'redirect') {
    const {
      payload: { window, owner, repo, type, branch, nodePath, openInNewTab }
    } = request;
    // Open a new tab
    if (openInNewTab) {
      try {
        const newTab = {
          windowId: window.windowId,
          url: createGithubUrl(owner, repo, type, branch, nodePath),
          active: true
        };
        await browser.tabs.create(newTab);
      } catch (error) {
        log.error('Error creating tab', error);
      }
    }
    // Send redirect event to active tab
    else {
      try {
        // Instead of triggering a content script which is unreliable when it doesn't load
        // on the page correctly all the time. Inject listener and then send message
        await browser.tabs
          .executeScript(window.tabId, {
            file: resolveInjectJSFilenames('background.redirect.inject')
          })
          .catch((e) => {
            log.error('Error injecting redirect script', e);
          });

        const response = {
          action: 'redirect-content-script',
          payload: request.payload
        };
        browser.tabs.sendMessage(window.tabId, response).catch((e) => {
          log.warn(
            'Cannot message because extension is not open',
            e?.message,
            response
          );
        });
      } catch (error) {
        log.error('Error redirecting active tab', error);
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
      log.warn('Error redirecting to url', error);
    }
    return null;
  }

  // Redirect to session (open up all tabs in session)
  if (request.action === 'redirect-to-session') {
    const {
      payload: { session }
    } = request;
    try {
      if (session.tabs.length === 0) {
        log.warn('Session is empty');
        return;
      }

      // Create a new window to put this session into
      browser.windows.create({
        focused: true,
        url: session.tabs.map(
          ({ url, repo, name: branchName, nodeName }) =>
            url ||
            createGithubUrl(
              repo.owner,
              repo.name,
              repo.type,
              branchName,
              nodeName
            )
        )
      });

      log.debug('REDIRECT TO SESSION', session);
    } catch (error) {
      log.warn('Error redirecting to url', error);
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
      await sendActiveTabChanged(tab);

      // To let frontend know when tab updates have been made.
      return { action: 'change-active-tab', complete: true };
    } catch (error) {
      log.error('Error changing active tab', error);
    }
    return null;
  }

  // Get open repository files by scanning all open tabs
  // Expensive so don't call this often
  if (request.action === 'get-open-repositories') {
    try {
      const openRepositories = await getParsedOpenRepositories();

      return {
        action: 'get-open-repositories',
        payload: openRepositories
      };
    } catch (error) {
      log.error('Error getting all windows', error);
    }
    return null;
  }

  // Change active tab (when branch node is clicked)
  if (request.action === 'close-tab') {
    try {
      await browser.tabs.remove(request.payload.tabId);
      return { action: 'close-tab', complete: true };
    } catch (error) {
      log.error('Error changing active tab', error);
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
      'redirect-to-session',
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
    log.error('Error initializing open tabs', error);
  }
};
initializeOpenTabs();

const sendOpenRepositoryUpdatesMessage = async () => {
  try {
    const openRepositories = await getParsedOpenRepositories();
    const response = {
      action: 'tab-updated',
      payload: openRepositories
    };
    browser.runtime.sendMessage(response).catch((e) => {
      log.warn(
        'Cannot send message because extension is not open',
        e?.message,
        response
      );
    });
  } catch (error) {
    log.error('Error updating open repositories', error);
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
      sendActiveTabChanged(tab);
    }
  });
};
initializeTabListeners();
