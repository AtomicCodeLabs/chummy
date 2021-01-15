import browser from 'webextension-polyfill';
import Bowser from 'bowser';

import log from '../config/log';
import { NO_WINDOW_EXTENSION_ID } from './constants.ts';
import {
  getSidebarWidth,
  isCurrentWindow,
  UrlParser,
  isExtensionOpen,
  getInitialDimensions
} from './util';

const isMoz =
  Bowser.getParser(window.navigator.userAgent).getBrowser().name === 'Firefox';

// Called when the user clicks on the extension icon
const onBrowserActionClickedListener = async () => {
  try {
    // Get current window, and calculate new dimensions
    const mainWin = await browser.windows.getCurrent();
    // Get isSidebarMinimized and sidebarWidth from storage
    const {
      isSidebarMinimized,
      sidebarWidth,
      // lastOpenedUrl,
      sidebarSide
    } = await browser.storage.sync.get([
      'isSidebarMinimized',
      'sidebarWidth',
      'lastOpenedUrl',
      'sidebarSide'
    ]);
    if (await isExtensionOpen()) {
      log.error("Error opening extension because it's already open");
      return;
    }
    const { nextMainWin, nextExtensionWin } = getInitialDimensions(
      isSidebarMinimized,
      sidebarWidth,
      sidebarSide,
      mainWin
    );

    // Create extension window
    const extensionWin = await browser.windows.create({
      url: browser.runtime.getURL('popup.html'),
      type: 'popup',
      top: nextExtensionWin.top,
      left: nextExtensionWin.left,
      width: nextExtensionWin.width, // Take over max half of original width
      height: nextExtensionWin.height,
      ...(!isMoz && { focused: true })
    });

    // Update main window
    await browser.windows.update(mainWin.id, {
      left: nextMainWin.left,
      width: nextMainWin.width
    });

    // Store extension window id in storage
    await browser.storage.sync.set({ currentWindowId: extensionWin.id });
  } catch (error) {
    log.error('Error opening extension popup', error);
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
    }
  } catch (error) {
    log.error('Error resetting currentWindowId', error);
  }
};
browser.windows.onRemoved.addListener((windowId) => {
  onWindowRemoveListener(windowId);
});

// On window focus change or window resize, update the popup window so that
// it follows the current window. If the sticky window setting stored in
// chrome storage is off, ignore these events
const updatePopupBounds = async (mainWin) => {
  try {
    // Retrieve saved settings
    const {
      currentWindowId,
      isStickyWindow,
      isSidebarMinimized,
      sidebarWidth,
      sidebarSide
    } = await browser.storage.sync.get([
      'currentWindowId',
      'isStickyWindow',
      'isSidebarMinimized',
      'sidebarWidth',
      'sidebarSide'
    ]);

    // Validate window state
    if (
      !isStickyWindow || // If sticky window setting isn't on
      !mainWin || // If chosen window isn't main window
      currentWindowId === NO_WINDOW_EXTENSION_ID || // If extension is open
      isCurrentWindow(mainWin.id, currentWindowId) // If chosen window is extension
    ) {
      return;
    }

    // Get window
    const nextExtensionWidth = getSidebarWidth(
      isSidebarMinimized,
      sidebarWidth
    );
    await browser.windows.update(currentWindowId, {
      top: mainWin.top,
      left:
        sidebarSide === 'left'
          ? mainWin.left - nextExtensionWidth
          : mainWin.left + mainWin.width,
      height: mainWin.height
    });
  } catch (error) {
    log.error('Error updating popup bounds', error);
  }
};

// Called when active window is changed
const focusChangedSoUpdateDimensions = async (windowId) => {
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
    log.error('Error on retrieving currentWindowId', error);
  }
};
browser.windows.onFocusChanged.addListener((windowId) => {
  focusChangedSoUpdateDimensions(windowId);
});

// Called when active window is dragged or resized
if (browser.windows.onBoundsChanged) {
  browser.windows.onBoundsChanged.addListener((window) => {
    updatePopupBounds(window);
  });
}

const sendContentChangedMessage = (windowId, tabId, tabTitle, tabUrl) => {
  const parsed = new UrlParser(tabUrl, tabTitle, tabId).parse();
  const response = {
    action: 'active-tab-changed',
    payload: {
      ...parsed,
      isGithubRepoUrl: Object.keys(parsed).length !== 0,
      windowId,
      tabId
    }
  };
  browser.runtime.sendMessage(response).catch((e) => {
    log.warn(
      'Cannot send message because extension is not open',
      e?.message,
      response
    );
  });
};

// Emit change tab/window/focus event to change content
const onTabActivatedListener = async ({ windowId, tabId }) => {
  try {
    const { url, title } = await browser.tabs.get(tabId);
    sendContentChangedMessage(windowId, tabId, title, url);
  } catch (error) {
    log.error('Error on tab activate', error);
  }
};
browser.tabs.onActivated.addListener((tabInfo) => {
  onTabActivatedListener(tabInfo);
});
const focusChangedSoSendContent = async (windowId) => {
  try {
    // If window is the same as extension window, don't do anything
    const { currentWindowId } = await browser.storage.sync.get([
      'currentWindowId'
    ]);

    if (isCurrentWindow(windowId, currentWindowId)) {
      return;
    }
    const tabs = await browser.tabs.query({ active: true, windowId });
    const { url, id: tabId, title: tabTitle } = tabs[0];

    sendContentChangedMessage(windowId, tabId, tabTitle, url);
  } catch (error) {
    log.error('Error on tab focus change', error);
  }
};
browser.windows.onFocusChanged.addListener((windowId) => {
  focusChangedSoSendContent(windowId);
});

// Update popup sidebar side when user toggles it
const updatePopupSide = async (request) => {
  // If extension isn't open don't do anything
  if (!(await isExtensionOpen())) {
    return;
  }
  // Find the main window
  const mainWindow = await browser.windows.getLastFocused({
    populate: false,
    windowTypes: ['normal']
  });

  // Update extension boundaries
  const { currentWindowId, sidebarWidth } = await browser.storage.sync.get([
    'currentWindowId',
    'sidebarWidth'
  ]);

  // Main window and extension window switch places
  const { prevSide, nextSide } = request.payload;
  // L->R
  if (prevSide === 'left' && nextSide === 'right') {
    // update extension
    await browser.windows.update(currentWindowId, {
      top: mainWindow.top,
      left: mainWindow.left - sidebarWidth + mainWindow.width,
      height: mainWindow.height,
      focused: true
    });
    // update main window
    await browser.windows.update(mainWindow.id, {
      left: mainWindow.left - sidebarWidth
    });
  }
  // R->L
  else {
    // update extension
    await browser.windows.update(currentWindowId, {
      top: mainWindow.top,
      left: mainWindow.left,
      height: mainWindow.height,
      focused: true
    });
    // update main window
    await browser.windows.update(mainWindow.id, {
      left: mainWindow.left + sidebarWidth
    });
  }
};
browser.runtime.onMessage.addListener((request) => {
  if (['sidebar-side-updated'].includes(request.action)) {
    return updatePopupSide(request);
  }
});
