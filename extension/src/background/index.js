import browser from 'webextension-polyfill';
import { NO_WINDOW_EXTENSION_ID } from './constants.ts';
import {
  getSidebarWidth,
  isCurrentWindow,
  UrlParser,
  isExtensionOpen
} from './util';

// Called when the user clicks on the extension icon
const onBrowserActionClickedListener = async () => {
  try {
    // Get current window, and calculate new dimensions
    const currentWin = await browser.windows.getCurrent();
    // Get isSidebarMinimized and sidebarWidth from storage
    const {
      isSidebarMinimized,
      sidebarWidth
    } = await browser.storage.sync.get(['isSidebarMinimized', 'sidebarWidth']);
    if (await isExtensionOpen()) {
      console.log('extension is open');
      return;
    }
    const newWidth = getSidebarWidth(isSidebarMinimized, sidebarWidth);
    // Create new window
    const win = await browser.windows.create({
      url: browser.runtime.getURL('popup.html'),
      type: 'popup',
      top: currentWin.top,
      left: Math.floor(currentWin.left - newWidth),
      width: newWidth, // Take over max half of original width
      height: currentWin.height
    });
    await browser.windows.update(currentWin.id, {
      left: currentWin.left,
      width: currentWin.width
    });
    // Store extension window id in storage
    await browser.storage.sync.set({ currentWindowId: win.id });
  } catch (error) {
    console.error('Error opening extension popup', error);
  }
};
browser.browserAction.onClicked.addListener(() => {
  onBrowserActionClickedListener();
});

// On popup window close, set currentWindowId to -1.
const onWindowRemoveListener = async (windowId) => {
  try {
    const { currentWindowId } = await browser.storage.sync.get([
      'currentWindowId'
    ]);
    if (isCurrentWindow(windowId, currentWindowId)) {
      await browser.storage.sync.set({
        currentWindowId: NO_WINDOW_EXTENSION_ID
      });
      console.log(
        'Current window closed and stored id',
        NO_WINDOW_EXTENSION_ID
      );
    }
  } catch (error) {
    console.error('Error resetting currentWindowId', error);
  }
};
browser.windows.onRemoved.addListener((windowId) => {
  onWindowRemoveListener(windowId);
});

// On window focus change or window resize, update the popup window so that
// it follows the current window. If the sticky window setting stored in
// chrome storage is off, ignore these events
const updatePopupBounds = async (mainWindow) => {
  try {
    // Retrieve saved settings
    const {
      currentWindowId,
      isStickyWindow,
      isSidebarMinimized,
      sidebarWidth
    } = await browser.storage.sync.get([
      'currentWindowId',
      'isStickyWindow',
      'isSidebarMinimized',
      'sidebarWidth'
    ]);

    // Ignore current window or if isStickyWindow is false
    if (
      !mainWindow ||
      currentWindowId === NO_WINDOW_EXTENSION_ID ||
      isCurrentWindow(mainWindow.id, currentWindowId) ||
      !isStickyWindow
    ) {
      return;
    }

    // Get window
    const newWidth = getSidebarWidth(isSidebarMinimized, sidebarWidth);
    await browser.windows.update(currentWindowId, {
      top: mainWindow.top,
      left: Math.floor(mainWindow.left - newWidth),
      height: mainWindow.height
      // alwaysOnTop: true
    });
  } catch (error) {
    console.error('Error updating popup bounds', error);
  }
};

// Called when active window is changed
const onFocusChangeListener = async (windowId) => {
  try {
    const { currentWindowId } = await browser.storage.sync.get([
      'currentWindowId'
    ]);
    // Ignore current window or if isStickyWindow is false
    if (isCurrentWindow(windowId, currentWindowId)) {
      return;
    }
    const window = await browser.windows.get(windowId);
    updatePopupBounds(window);
  } catch (error) {
    console.error('Error on retrieving currentWindowId', error);
  }
};
browser.windows.onFocusChanged.addListener((windowId) => {
  onFocusChangeListener(windowId);
});

// Called when active window is dragged or resized
browser.windows.onBoundsChanged.addListener((window) => {
  updatePopupBounds(window);
});

const sendContentChangedMessage = (windowId, tabId, tabTitle, tabUrl) => {
  const parsed = new UrlParser(tabUrl, tabTitle, tabId).parse();
  browser.runtime.sendMessage({
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
const onTabActivatedListener = async ({ windowId, tabId }) => {
  try {
    const { url, title } = await browser.tabs.get(tabId);
    sendContentChangedMessage(windowId, tabId, title, url);
  } catch (error) {
    console.error('Error on tab activate', error);
  }
};
browser.tabs.onActivated.addListener((tabInfo) => {
  onTabActivatedListener(tabInfo);
});
const onFocusChangedListener = async (windowId) => {
  try {
    // If window is the same as extension window, don't do anything
    const { currentWindowId } = await browser.storage.sync.get([
      'currentWindowId'
    ]);

    // console.log('Current window id retrieved from storage', windowId, currentWindowId);
    if (isCurrentWindow(windowId, currentWindowId)) {
      return;
    }
    const tabs = await browser.tabs.query({ active: true, windowId });
    const { url, id: tabId, title: tabTitle } = tabs[0];

    sendContentChangedMessage(windowId, tabId, tabTitle, url);
  } catch (error) {
    console.error('Error on tab focus change', error);
  }
};
browser.windows.onFocusChanged.addListener((windowId) => {
  onFocusChangedListener(windowId);
});
