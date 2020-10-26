/* global chrome */

import { UrlParser } from './util';
import { EXTENSION_WIDTH, SIDE_TAB } from '../constants/sizes';

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
  // Get current window, and calculate new dimensions
  chrome.windows.getCurrent((currentWin) => {
    // Get isSidebarMinimized and sidebarWidth from storage
    chrome.storage.sync.get(['isSidebarMinimized', 'sidebarWidth'], (items) => {
      let lastWindowWidth = EXTENSION_WIDTH.INITIAL;
      if (items.isSidebarMinimized) {
        lastWindowWidth = SIDE_TAB.WIDTH + 13;
      } else if (items.sidebarWidth) {
        lastWindowWidth = items.sidebarWidth;
      }
      const newWidth = lastWindowWidth
      // Create new window
      chrome.windows.create(
        {
          url: chrome.runtime.getURL('popup.html'),
          type: 'popup',
          top: currentWin.top,
          left: currentWin.left - newWidth,
          width: newWidth, // Take over max half of original width
          height: currentWin.height
        },
        (win) => {
          // Update old (previously current) window with new top, left, and width
          chrome.windows.update(currentWin.id, {
            left: currentWin.left,
            width: currentWin.width
          });
          // Store extension window id in storage
          chrome.storage.sync.set({ currentWindowId: win.id }, () => {
            console.log('Current window id stored', win.id);
          });
        }
      );
    });
  });
});

const sendContentChangedMessage = (windowId, tabId, tabTitle, tabUrl) => {
  const parsed = new UrlParser(tabUrl, tabTitle, tabId).parse();
  chrome.runtime.sendMessage({
    action: 'active-tab-changed',
    payload: {
      ...parsed,
      isGithubRepoUrl: Object.keys(parsed).length !== 0,
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
