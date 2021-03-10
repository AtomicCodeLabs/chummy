/* eslint-disable camelcase */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
import browser from 'webextension-polyfill';
import url from 'url';
import path from 'path';

import log from '../config/log';
import { EXTENSION_WIDTH, SIDE_TAB } from '../constants/sizes';
import { GITHUB_REGEX, NO_WINDOW_EXTENSION_ID } from './constants';
import { SIDEBAR_SIDE } from '../global/constants';
import { isChromium } from '../config/browser';

export const isExtensionOpen = async () => {
  try {
    const { currentWindowId } = await browser.storage.sync.get([
      'currentWindowId'
    ]);
    if (currentWindowId === NO_WINDOW_EXTENSION_ID) {
      return false;
    }

    // If currentWindowId is not NO_WINDOW_EXTENSION_ID, check if
    // window exists. If it doesn't, reset currentWindowId to
    // NO_WINDOW_EXTENSION_ID and return false.
    const windows = await browser.windows.getAll();
    const allWindowIds = windows.map((w) => w.id);
    if (!allWindowIds.includes(currentWindowId)) {
      // Reset currentWindowId
      browser.storage.sync.set({ currentWindowId: NO_WINDOW_EXTENSION_ID });
      return false;
    }
    return true;
  } catch (error) {
    log.error('Error checking if extension is open', error);
    return false;
  }
};

export const isCurrentWindow = (windowId, currentWindowId) => {
  return (
    currentWindowId !== NO_WINDOW_EXTENSION_ID &&
    (windowId === currentWindowId ||
      windowId === browser.windows.WINDOW_ID_NONE)
  );
};

export const getSidebarWidth = (isSidebarMinimized, sidebarWidth) => {
  let lastWindowWidth = EXTENSION_WIDTH.INITIAL;
  if (isSidebarMinimized) {
    lastWindowWidth = SIDE_TAB.WIDTH + 13;
  } else if (sidebarWidth) {
    lastWindowWidth = sidebarWidth;
  }
  return lastWindowWidth;
};

/**
 * Calculates the new dimensions of the extension and main window on initial extension open
 *
 * Just append extension to specified sidebar side
 */
export const getInitialDimensions = (
  isSidebarMinimized,
  sidebarWidth,
  sidebarSide,
  mainWindowInitial
) => {
  const extensionWidth = getSidebarWidth(isSidebarMinimized, sidebarWidth);

  const isLeft = !sidebarSide || sidebarSide === SIDEBAR_SIDE.Left;
  // if sidebar side is undefined (can happen on initial startup or after cache is cleared),
  // set the sidebar side to left by default
  if (!sidebarSide) {
    browser.storage.sync.set({ sidebarSide: SIDEBAR_SIDE.Left });
  }

  // Right
  return {
    nextMainWin: mainWindowInitial,
    nextExtensionWin: {
      top: mainWindowInitial.top,
      left: isLeft
        ? mainWindowInitial.left - extensionWidth
        : mainWindowInitial.left + mainWindowInitial.width,
      width: extensionWidth,
      height: mainWindowInitial.height
    }
  };
};

/**
 * Calculates the new dimensions of the extension and main window on initial extension open
 *
 * Just append extension to specified sidebar side
 */
export const getSidebarSideUpdateDimensions = async (
  prevSide,
  nextSide,
  extensionId,
  mainWindowInitial,
  extensionWidth
) => {
  // const extensionWidth = getSidebarWidth(isSidebarMinimized, sidebarWidth);

  const appendLeft = {
    nextMainWin: mainWindowInitial,
    nextExtensionWin: {
      top: mainWindowInitial.top,
      left: mainWindowInitial.left - extensionWidth,
      width: extensionWidth,
      height: mainWindowInitial.height
    }
  };

  const appendRight = {
    nextMainWin: mainWindowInitial,
    nextExtensionWin: {
      top: mainWindowInitial.top,
      left: mainWindowInitial.left + mainWindowInitial.width,
      width: extensionWidth,
      height: mainWindowInitial.height
    }
  };

  // L->L
  // Make sure the extension is flush to the left of the main window
  if (prevSide === SIDEBAR_SIDE.Left && nextSide === SIDEBAR_SIDE.Left) {
    return appendLeft;
  }

  // R->R
  // Vice versa as above.
  if (prevSide === SIDEBAR_SIDE.Right && nextSide === SIDEBAR_SIDE.Right) {
    return appendRight;
  }

  const extensionWin = await browser.windows.get(extensionId);

  // L->R
  // If extension isn't flush (+-10pixels) to the left of the main window
  // just append extension to the right without updating the main window.
  // Else make room for the extension.
  if (prevSide === SIDEBAR_SIDE.Left && nextSide === SIDEBAR_SIDE.Right) {
    const isFlush =
      Math.abs(mainWindowInitial.left - extensionWin.left - extensionWidth) <=
      10;
    if (isFlush) {
      return {
        nextMainWin: {
          ...mainWindowInitial,
          left: mainWindowInitial.left - extensionWidth
        },
        nextExtensionWin: {
          top: mainWindowInitial.top,
          left:
            mainWindowInitial.left - extensionWidth + mainWindowInitial.width,
          width: extensionWidth,
          height: mainWindowInitial.height
        }
      };
    }
    return appendRight;
  }

  // R->L
  // Vice versa as above.
  if (prevSide === SIDEBAR_SIDE.Right && nextSide === SIDEBAR_SIDE.Left) {
    const isFlush =
      Math.abs(
        mainWindowInitial.left + mainWindowInitial.width - extensionWin.left
      ) <= 10;
    if (isFlush) {
      return {
        nextMainWin: {
          ...mainWindowInitial,
          left: mainWindowInitial.left + extensionWidth
        },
        nextExtensionWin: {
          top: mainWindowInitial.top,
          left: mainWindowInitial.left,
          width: extensionWidth,
          height: mainWindowInitial.height
        }
      };
    }
    return appendLeft;
  }

  return appendLeft;
};

export const isGithubRepoUrl = (tabUrl) => {
  return url && !!GITHUB_REGEX.exec(tabUrl);
};

// https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
export const isNumeric = (str) => {
  if (typeof str !== 'string') return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
};

export const isBlank = (o) => {
  if (!o) return true;
  if (o.constructor === Object) {
    return Object.entries(o).length === 0;
  }
  if (o.constructor === String) {
    return !o || o.trim().length === 0;
  }
  return false;
};

export const stripDomain = (s) => {
  // Remove https:// and https://www. from all urls
  return s.replace(/^(http|https):\/\/(www.)?/, '');
};

const decodePayload = (jwtToken) => {
  const payload = jwtToken.split('.')[1];
  try {
    return JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
  } catch (err) {
    return {};
  }
};

const calculateClockDrift = (iatAccessToken, iatIdToken) => {
  const now = Math.floor(new Date() / 1000);
  const iat = Math.min(iatAccessToken, iatIdToken);
  return now - iat;
};

export const storeTokens = (storage, data, clientId) => {
  // Manually login with credentials received from another window
  // https://github.com/aws-amplify/amplify-js/issues/825
  const idTokenData = decodePayload(data.idToken);
  const accessTokenData = decodePayload(data.accessToken);

  storage.setItem(
    `CognitoIdentityServiceProvider.${clientId}.LastAuthUser`,
    idTokenData['cognito:username']
  );
  storage.setItem(
    `CognitoIdentityServiceProvider.${clientId}.${idTokenData['cognito:username']}.idToken`,
    data.idToken
  );
  storage.setItem(
    `CognitoIdentityServiceProvider.${clientId}.${idTokenData['cognito:username']}.accessToken`,
    data.accessToken
  );
  storage.setItem(
    `CognitoIdentityServiceProvider.${clientId}.${idTokenData['cognito:username']}.refreshToken`,
    data.refreshToken
  );
  storage.setItem(
    `CognitoIdentityServiceProvider.${clientId}.${idTokenData['cognito:username']}.clockDrift`,
    `${calculateClockDrift(accessTokenData.iat, idTokenData.iat)}`
  );
};

export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

export const isGamma = () => {
  return process.env.NODE_ENV === 'gamma';
};

export const isGammaOrProd = () => {
  return isGamma() || isProduction();
};

// Figure out if we need to append the version to the end
export const resolveInjectFilenames = (basename, ext = 'js') => {
  if (!isGammaOrProd()) {
    // must be dev
    return `${basename}.${ext}`;
  }
  // gamma and prod files are versioned
  return `${basename}_${process.env.VERSION}.${ext}`;
};

export const clone = (obj) => {
  // Handle errors separately
  const { error } = obj;
  // https://stackoverflow.com/questions/18391212/is-it-not-possible-to-stringify-an-error-using-json-stringify
  const parsedError = error
    ? JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)))
    : null;

  return {
    ...JSON.parse(JSON.stringify(obj)),
    ...(parsedError && { error: parsedError })
  };
};

export const createGithubUrl = (owner, repo, type, branch, nodePath) => {
  return url.resolve(
    'https://github.com/',
    path.join(owner, repo, type, branch, nodePath || '')
  );
};

export const onTabFinishPending = (tabId, callback) => {
  function listener(_tabId, _changeInfo, _tab) {
    if (_tabId === tabId && _tab.status === 'complete') {
      callback(_tab);
      browser.tabs.onUpdated.removeListener(listener);
    }
  }

  // Initialize listener
  // chromium doesn't support filters https://developer.chrome.com/docs/extensions/reference/tabs/#event-onUpdated
  if (isChromium) {
    browser.tabs.onUpdated.addListener(listener);
  } else {
    browser.tabs.onUpdated.addListener(listener, { tabId });
  }

  // Cleanup listener if not resolved in 1 minute
  setTimeout(() => {
    browser.tabs.onUpdated.removeListener(listener);
  }, 60_000);
};

export const syncTabStyle = async (tabId) => {
  await browser.tabs
    .executeScript(tabId, {
      file: resolveInjectFilenames('background.style.inject', 'js'),
      runAt: 'document_start'
    })
    .catch((e) => {
      log.error('Error injecting style script', e);
    });
  // Trigger listener with current style setting
  const { isDistractionFreeMode } = await browser.storage.sync.get([
    'isDistractionFreeMode'
  ]);
  const response = {
    action: 'distraction-free-content-script',
    payload: { isDistractionFreeMode }
  };
  browser.tabs.sendMessage(tabId, response).catch((e) => {
    log.warn('Cannot message because tab is not open', e?.message, response);
  });
};
