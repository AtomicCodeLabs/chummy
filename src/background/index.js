/* global chrome */

import { parseUrl, isGithubRepoUrl } from './util';
import { EXTENSION_WIDTH } from '../constants/sizes';

// Rules set when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'github.com' }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});

// Called when the user clicks on the extension icon
chrome.browserAction.onClicked.addListener(() => {
  chrome.windows.create(
    {
      url: chrome.runtime.getURL('popup.html'),
      type: 'popup',
      width: EXTENSION_WIDTH.INITIAL
    },
    (win) => {
      // Store extension window id in storage
      chrome.storage.sync.set({ currentWindowId: win.id }, () => {
        console.log('Current window id stored', win.id);
      });
    }
  );
});

const sendContentChangedMessage = (windowId, tabId, tabTitle, tabUrl) => {
  const isGRUrl = isGithubRepoUrl(tabUrl);
  chrome.runtime.sendMessage({
    action: 'active-tab-changed',
    payload: {
      ...(isGRUrl && parseUrl(tabUrl, tabTitle, tabId)),
      isGithubRepoUrl: isGRUrl,
      windowId,
      tabId
    }
  });
};

// Emit change tab/window/focus event to change content
chrome.tabs.onActivated.addListener(({ windowId, tabId }) => {
  chrome.tabs.get(tabId, ({ url, title }) => {
    sendContentChangedMessage(windowId, tabId, title, url);
  });
});
chrome.windows.onFocusChanged.addListener((windowId) => {
  // If window is the same as extension window, don't do anything
  chrome.storage.sync.get(['currentWindowId'], ({ currentWindowId }) => {
    // console.log('Current window id retrieved from storage', windowId, currentWindowId);
    if (
      windowId === currentWindowId ||
      windowId === chrome.windows.WINDOW_ID_NONE
    ) {
      return;
    }
    chrome.tabs.query({ active: true, windowId }, (tabs) => {
      const { url, id: tabId, title: tabTitle } = tabs[0];

      sendContentChangedMessage(windowId, tabId, tabTitle, url);
    });
  });
});
