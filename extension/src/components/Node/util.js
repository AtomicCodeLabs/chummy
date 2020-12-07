/* eslint-disable no-plusplus */
import React from 'react';
import browser from 'webextension-polyfill';
import urlUtil from 'url';
import pathUtil from 'path';

export const redirectTo = (
  base,
  filepath,
  currentWindowTab,
  openInNewTab = false
) => {
  const request = {
    action: 'redirect',
    payload: { window: currentWindowTab, base, filepath, openInNewTab }
  };
  console.log(
    '%cRedirect request -> bg',
    'background-color: #00c853; color: white;',
    request
  );
  browser.runtime.sendMessage(request);
};

export const redirectToUrl = (url) => {
  const request = {
    action: 'redirect-to-url',
    payload: { url }
  };
  console.log(
    '%cRedirect to url request -> bg',
    'background-color: #00c853; color: white;',
    request
  );
  browser.runtime.sendMessage(request);
};

export const changeActiveTab = async (destinationTabId) => {
  try {
    const request = {
      action: 'change-active-tab',
      payload: { destinationTabId }
    };
    console.log(
      '%cChange active tab request -> bg',
      'background-color: #00c853; color: white;',
      request
    );
    const response = await browser.runtime.sendMessage(request);
    console.log('Response', response);
    if (response?.complete) {
      return true;
    }
  } catch (error) {
    console.warn('Error changing active tab', error);
    return false;
  }
};

export const closeTab = async (tabId) => {
  try {
    const request = {
      action: 'close-tab',
      payload: { tabId }
    };
    console.log(
      '%cClose tab request -> bg',
      'background-color: #00c853; color: white;',
      request
    );
    const response = await browser.runtime.sendMessage(request);
    console.log('Response', response);

    if (response?.complete) {
      return true;
    }
  } catch (error) {
    console.warn('Error closing tab', error);
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

export const processBookmarkInformation = (bookmark) => {
  const { parentPath, fileName } = parseFilePath(bookmark.path);
  return {
    primaryText: decodeURI(fileName),
    secondaryText: parentPath,
    subpageText: bookmark?.branch?.name || 'master' // repo branch name
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
  if (!bookmark?.repo || !bookmark?.path) {
    return null;
  }
  const { repo, branch, path } = bookmark;
  return urlUtil.resolve(
    'https://github.com/',
    pathUtil.join(
      `/${repo.owner}/${repo.name}`,
      `/blob/${branch?.name || 'master'}/${path}`
    )
  );
};

export const clickedEl = (ref, event) =>
  ref.current &&
  (event.target === ref.current || ref.current.contains(event.target));

export const createBookmark = (owner, repo, branch, node) => ({
  bookmarkId: `bookmark-${owner}:${repo}:${node.path}`,
  pinned: false,
  name: node.name,
  path: node.path,
  repo: {
    owner,
    name: repo
  },
  branch: {
    name: branch
  }
});

// Return React text nodes with sections highlighted per the matches passed in
export const highlightTextPart = (fragment, matches) => {
  if (matches.length === 0) return [fragment];
  // eslint-disable-next-line prefer-const
  let textNodes = [];
  let lastL = 0;
  const maxR = fragment.length;
  matches.forEach(([l, r], i) => {
    if (l >= maxR) {
      return;
    }
    // If first match, push start of string
    textNodes.push(fragment.slice(lastL, l));
    textNodes.push(
      <span key={`${l}-${r}`} className="highlight">
        {fragment.slice(l, Math.min(r, maxR))}
      </span>
    );
    // If last match, push end of string
    if (i === matches.length - 1 && r !== maxR) {
      textNodes.push(fragment.slice(r));
    }
    lastL = r;
  });
  return textNodes;
};
