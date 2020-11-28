/* eslint-disable camelcase */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
import browser from 'webextension-polyfill';
import { EXTENSION_WIDTH, SIDE_TAB } from '../constants/sizes';
import {
  SUBPAGES,
  GITHUB_REGEX,
  REPO_TITLE_REGEX,
  generate_ISSUE_TITLE_REGEX,
  generate_PULL_TITLE_REGEX,
  NO_WINDOW_EXTENSION_ID
} from './constants.ts';

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
    console.warn('Error checking if extension is open', error);
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

export const isGithubRepoUrl = (url) => {
  return url && !!GITHUB_REGEX.exec(url);
};

// https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
export const isNumeric = (str) => {
  if (typeof str !== 'string') return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
};

export class UrlParser {
  constructor(url, title, tabId = null) {
    this.url = url;
    this.title = title;
    this.tabId = tabId;
    this.isGithubRepoUrl = isGithubRepoUrl(url);
    this.urlObject = null;
    this.parsedRepoInfo = null;
    this.subpage = null;
    this.owner = null;
    this.repo = null;
    if (this.isGithubRepoUrl) {
      this.urlObject = new URL(url);
      this.parsedRepoInfo = this.urlObject.pathname.slice(1).split('/');
      this.subpage = this.#getSubpage(this.parsedRepoInfo);
      this.owner = this.parsedRepoInfo[0];
      this.repo = this.parsedRepoInfo[1];
    }
    // Payload
    this.payloadRepoInfo = {
      url: this.url,
      owner: this.owner,
      repo: this.repo,
      tab: {
        name: 'master',
        nodeName: null,
        tabId: this.tabId,
        subpage: this.subpage
      }
    };
  }

  parse() {
    if (!this.isGithubRepoUrl) return {};

    if (this.subpage === SUBPAGES.REPOSITORY) {
      return this.#handleRepositorySubpage();
    }
    if (this.subpage === SUBPAGES.ISSUES) {
      return this.#handleIssuesSubpage();
    }
    if (this.subpage === SUBPAGES.PULLS) {
      return this.#handlePullsSubpage();
    }
    if (this.subpage === SUBPAGES.ACTIONS) {
      return this.#handleActionsSubpage();
    }
    if (this.subpage === SUBPAGES.PROJECTS) {
      return this.#handleProjectsSubpage();
    }
    if (this.subpage === SUBPAGES.WIKI) {
      return this.#handleWikiSubpage();
    }
    if (this.subpage === SUBPAGES.SECURITY) {
      return this.#handleSecuritySubpage();
    }
    if (this.subpage === SUBPAGES.PULSE) {
      return this.#handlePulseSubpage();
    }
    if (this.subpage === SUBPAGES.SETTINGS) {
      return this.#handleSettingsSubpage();
    }

    return this.payloadRepoInfo;
  }

  #getSubpage = () => {
    // Handle repository subpage
    if (
      this.parsedRepoInfo.length === 2 ||
      (this.parsedRepoInfo.length >= 3 &&
        ['tree', 'blob'].includes(this.parsedRepoInfo[2]))
    ) {
      return SUBPAGES.REPOSITORY;
    }
    // Handle other possible subpages
    if (
      this.parsedRepoInfo.length >= 3 &&
      Object.values(SUBPAGES).includes(this.parsedRepoInfo[2])
    ) {
      return this.parsedRepoInfo[2];
    }
    // For some reason, github doesn't pluralize `pull` when on a specific
    // pull request page, like it does with `issues`. Catch this exception
    // ungracefully here.
    if (this.parsedRepoInfo[2] === 'pull') {
      return SUBPAGES.PULLS;
    }
    return 'other';
  };

  // [owner, repo, tree?/blob?, filePath?[*?/*]]
  #handleRepositorySubpage = () => {
    const isRootMaster =
      this.parsedRepoInfo.length === 2 ||
      (this.parsedRepoInfo.length === 4 && this.parsedRepoInfo[3] === 'master');
    if (isRootMaster) {
      return {
        ...this.payloadRepoInfo,
        tab: {
          name: 'master', // field reserved for branchName
          tabId: this.tabId,
          subpage: this.subpage,
          nodeName: null
        },
        type: 'tree'
      };
    }
    // If not root master
    // tabTitle looks like "G-Desktop-Suite/gsuite.rb at revert-68-code-quality-66-prettify · alexkim205/G-Desktop-Suite"
    // Get branch information from tab title, because it's impossible to discern from
    // just the url if the branch name has /'s
    const regexedTitle = this.title.match(REPO_TITLE_REGEX);
    // Get everything in between " at " and " . "; fallback to getting url from url
    const branchName = regexedTitle ? regexedTitle[1] : this.parsedRepoInfo[3];
    const parsedWithoutBranch = this.urlObject.pathname
      .slice(1)
      .replace(`/${branchName}`, '') // remove branch from url to get
      .split('/'); // [alexkim205, tomaso, tree?/blob?, filePath?[*?/*]]
    const parsedFilePath = parsedWithoutBranch.slice(3).join('/');
    return {
      ...this.payloadRepoInfo,
      tab: {
        name: branchName,
        tabId: this.tabId,
        subpage: this.subpage,
        nodeName: parsedFilePath
      },
      type: parsedWithoutBranch[2]
    };
  };

  // [owner, repo, issues, issueNumber?]
  // [owner, repo, issues, "new", "choose"]
  #handleIssuesSubpage = () => {
    const isRoot = this.parsedRepoInfo.length === 3;
    if (isRoot) {
      return {
        ...this.payloadRepoInfo,
        tab: {
          name: 'master',
          nodeName: '/',
          tabId: this.tabId,
          subpage: this.subpage,
          id: null
        }
      };
    }
    if (isNumeric(this.parsedRepoInfo[3])) {
      const issueId = parseInt(this.parsedRepoInfo[3], 10);
      const regexedTitle = this.title.match(
        generate_ISSUE_TITLE_REGEX(issueId)
      );
      const issueName = regexedTitle ? regexedTitle[1] : 'Issue';
      return {
        ...this.payloadRepoInfo,
        tab: {
          name: 'master',
          nodeName: issueName,
          tabId: this.tabId,
          subpage: this.subpage,
          id: issueId
        }
      };
    }
    // If it's a subpage that's not handled, just return this.parsedRepoInfo
    return this.payloadRepoInfo;
  };

  #handlePullsSubpage = () => {
    const isRoot = this.parsedRepoInfo.length === 3;
    if (isRoot) {
      return {
        ...this.payloadRepoInfo,
        tab: {
          name: 'master',
          nodeName: '/',
          tabId: this.tabId,
          subpage: this.subpage,
          id: null
        }
      };
    }
    if (isNumeric(this.parsedRepoInfo[3])) {
      const pullId = parseInt(this.parsedRepoInfo[3], 10);
      const regexedTitle = this.title.match(generate_PULL_TITLE_REGEX(pullId));
      const pullName = regexedTitle ? regexedTitle[1] : 'Pull Request';
      return {
        ...this.payloadRepoInfo,
        tab: {
          name: 'master',
          nodeName: pullName,
          tabId: this.tabId,
          subpage: this.subpage,
          id: pullId
        }
      };
    }
    // If it's a subpage that's not handled, just return this.parsedRepoInfo
    return this.payloadRepoInfo;
  };

  // If it's a subpage that's not handled, just return this.parsedRepoInfo
  #handleActionsSubpage = () => this.payloadRepoInfo;

  #handleProjectsSubpage = () => this.payloadRepoInfo;

  #handleWikiSubpage = () => this.payloadRepoInfo;

  #handleSecuritySubpage = () => this.payloadRepoInfo;

  #handlePulseSubpage = () => this.payloadRepoInfo;

  #handleSettingsSubpage = () => this.payloadRepoInfo;
}
