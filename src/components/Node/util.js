/* eslint-disable no-plusplus */
import browser from 'webextension-polyfill';
import urlUtil from 'url';
import pathUtil from 'path';

export const redirectTo = (
  base,
  filepath,
  currentWindowTab,
  openInNewTab = false
) => {
  browser.runtime.sendMessage({
    action: 'redirect',
    payload: { window: currentWindowTab, base, filepath, openInNewTab }
  });
};

export const redirectToUrl = (url) => {
  browser.runtime.sendMessage({
    action: 'redirect-to-url',
    payload: { url }
  });
};

export const changeActiveTab = async (destinationTabId) => {
  try {
    const response = await browser.runtime.sendMessage({
      action: 'change-active-tab',
      payload: { destinationTabId }
    });
    if (response?.complete) {
      return true;
    }
  } catch (error) {
    console.error('Error changing active tab', error);
    return false;
  }
};

export const parseFilePath = (filePath) => {
  if (!filePath) return { parentPath: '', fileName: '/' };
  const parsed = filePath.split('/');
  const parentPath = parsed.slice(0, -1).join('/');
  const fileName = parsed.slice(-1);
  return { parentPath, fileName };
};

export const processTabInformation = (tab) => {
  const { subpage } = tab;
  if (subpage === 'repository') {
    const { parentPath, fileName } = parseFilePath(tab.nodeName);
    return {
      primaryText: decodeURI(fileName),
      secondaryText: parentPath,
      subpageText: tab.name // repo branch name
    };
  }
  if (subpage === 'issues' || subpage === 'pulls') {
    return {
      primaryText: tab.nodeName,
      secondaryText: tab.id,
      subpageText: subpage
    };
  }

  /* TODO
   * - actions
   * - projects
   * - wiki
   * - security
   * - pulse
   * - settings
   */

  return {
    primaryText: '/',
    secondaryText: '',
    subpageText: subpage
  };
};

export const getMatchFragment = (fragment, matchStart, matchEnd) => {
  const flankedFrag = `\n${fragment}\n`;
  // Let's say max characters on either side of the match is 50. Beginning
  // and end truncated with ellipses, with match in the center.

  // Get two surrounding words on each side. If new line, stop
  // collecting word on that side.
  let whitespaceLeft = 2;
  let truncatedLeft = false;
  let whitespaceRight = 2;
  let truncatedRight = false;
  let l = matchStart;
  let r = matchEnd;
  for (; l > 0; l--) {
    if (flankedFrag[l] === '\n' || whitespaceLeft === 0) {
      break;
    }
    if (matchStart === ' ') {
      whitespaceLeft--;
    }
  }
  for (; r < flankedFrag.length; r++) {
    if (flankedFrag[r] === '\n' || whitespaceRight === 0) {
      break;
    }
    if (matchStart === ' ') {
      whitespaceRight--;
    }
  }

  // Truncate to 50 on both sides
  if (matchStart - l > 50) {
    l = matchStart - 50;
    truncatedLeft = true;
  }
  if (r - matchEnd > 50) {
    r = matchEnd + 50;
    truncatedRight = true;
  }

  return {
    matchFragment: `${truncatedLeft ? '...' : ''}${flankedFrag.slice(l, r)}${
      truncatedRight ? '...' : ''
    }`,
    start: matchStart - l + 1 + (truncatedLeft ? 3 : 0),
    end: matchEnd - l + 1 + (truncatedLeft ? 3 : 0)
  };
};

export const getBookmarkUrl = (bookmark) => {
  if (!bookmark?.repo || !bookmark?.branch || !bookmark?.path) {
    return null;
  }
  const { repo, branch, path } = bookmark;
  return urlUtil.resolve(
    'https://github.com/',
    pathUtil.join(`/${repo.owner}/${repo.name}`, `/blob/${branch.name}/${path}`)
  );
};

export const clickedEl = (ref, event) =>
  ref.current &&
  (event.target === ref.current || ref.current.contains(event.target));
