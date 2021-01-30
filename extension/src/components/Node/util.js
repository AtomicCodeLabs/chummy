/* eslint-disable no-plusplus */
import React from 'react';
import urlUtil from 'url';
import pathUtil from 'path';
import browser from 'webextension-polyfill';
import cloneDeep from 'lodash.clonedeep';

import log from '../../config/log';

export const redirectTo = (
  owner,
  repo,
  type,
  branch,
  nodePath,
  currentWindowTab,
  openInNewTab = false
) => {
  const request = cloneDeep({
    action: 'redirect',
    payload: {
      window: currentWindowTab,
      owner,
      repo,
      type,
      branch,
      nodePath,
      openInNewTab
    }
  });
  log.toBg('Redirect request -> bg', request);
  browser.runtime.sendMessage(request);
};

export const changeActiveTab = async (destinationTabId) => {
  try {
    const request = {
      action: 'change-active-tab',
      payload: { destinationTabId }
    };
    log.toBg('Change active tab request -> bg', request);
    const response = await browser.runtime.sendMessage(request);
    if (response?.complete) {
      return true;
    }
  } catch (error) {
    log.error('Error changing active tab', error);
    return false;
  }
};

export const closeTab = async (tabId) => {
  try {
    const request = {
      action: 'close-tab',
      payload: { tabId }
    };
    log.toBg('Close tab request -> bg', request);
    const response = await browser.runtime.sendMessage(request);
    log.debug('Response', response);

    if (response?.complete) {
      return true;
    }
  } catch (error) {
    log.error('Error closing tab', error);
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
    subpageText: bookmark?.branch?.name
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

// https://www.tutorialspoint.com/finding-the-longest-common-consecutive-substring-between-two-strings-in-javascript
export const findCommonSubstring = (str1 = '', str2 = '') => {
  const s1 = [...str1];
  const s2 = [...str2];
  const arr = Array(s2.length + 1)
    .fill(null)
    .map(() => {
      return Array(s1.length + 1).fill(null);
    });
  for (let j = 0; j <= s1.length; j += 1) {
    arr[0][j] = 0;
  }
  for (let i = 0; i <= s2.length; i += 1) {
    arr[i][0] = 0;
  }
  let len = 0;
  let col = 0;
  let row = 0;
  for (let i = 1; i <= s2.length; i += 1) {
    for (let j = 1; j <= s1.length; j += 1) {
      if (s1[j - 1] === s2[i - 1]) {
        arr[i][j] = arr[i - 1][j - 1] + 1;
      } else {
        arr[i][j] = 0;
      }
      if (arr[i][j] > len) {
        len = arr[i][j];
        col = j;
        row = i;
      }
    }
  }
  if (len === 0) {
    return '';
  }
  let res = '';
  while (arr[row][col] > 0) {
    res = s1[col - 1] + res;
    row -= 1;
    col -= 1;
  }
  return res;
};

export const getNameFragmentIndices = (query, name) => {
  // Ignore words containing : qualifier symbol in query
  const parsedQuery = query
    .split(' ')
    .filter((word) => !word.includes(':'))
    .join(' ')
    .toLowerCase();

  const parsedName = name.toLowerCase();

  const commonSubstring = findCommonSubstring(parsedQuery, parsedName);
  if (!commonSubstring) {
    return { start: -1, end: -1 };
  }
  const start = parsedName.indexOf(commonSubstring);
  const end = start + commonSubstring.length;
  return { start, end };
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
      `/blob/${branch?.name}/${path}`
    )
  );
};

export const renderName = (n, query) => {
  // Try to find matching fragments
  const { start, end } = getNameFragmentIndices(query, n);

  if (start === -1 || end === -1) {
    return n;
  }

  return (
    <span>
      {n.slice(0, start)}
      <span className="highlight">{n.slice(start, end)}</span>
      {n.slice(end)}
    </span>
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
