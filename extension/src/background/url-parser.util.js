/* eslint-disable camelcase */
/* eslint-disable prefer-destructuring */
import { graphql } from '@octokit/graphql';
import browser from 'webextension-polyfill';

import {
  REPO_TITLE_REGEX,
  generate_ISSUE_TITLE_REGEX,
  generate_PULL_TITLE_REGEX
} from './constants';
import { SUBPAGES, GLOBAL_SUBPAGES, DEFAULT_BRANCH } from '../global/constants';
import { UserError } from '../global/errors';
import log from '../config/log';
import { isGithubRepoUrl, isNumeric, isBlank, syncTabStyle } from './util';

export default class UrlParser {
  static async build(
    url,
    title,
    tabId = null,
    cachedRepoToDefaultBranch = new Map() // Map of default branches of repositories that we've parsed. Cached for easy access
  ) {
    const newUrl = new UrlParser();
    newUrl.url = url;
    newUrl.title = title;
    newUrl.tabId = tabId;
    newUrl.isGithubRepoUrl = isGithubRepoUrl(url);
    newUrl.urlObject = null;
    newUrl.parsedRepoInfo = null;
    newUrl.subpage = null;
    newUrl.owner = null;
    newUrl.repo = null;
    newUrl.defaultBranch = DEFAULT_BRANCH;
    newUrl.cachedRepoToDefaultBranch = cachedRepoToDefaultBranch;

    if (newUrl.isGithubRepoUrl) {
      newUrl.urlObject = new URL(url);
      newUrl.parsedRepoInfo = newUrl.urlObject.pathname.slice(1).split('/');
      newUrl.subpage = newUrl.#getSubpage(newUrl.parsedRepoInfo);
      newUrl.owner = newUrl.parsedRepoInfo[0];
      newUrl.repo = newUrl.parsedRepoInfo[1];

      if (newUrl.subpage === SUBPAGES.Repository) {
        // Get default branch name
        const {
          defaultBranch,
          cachedRepoToDefaultBranch: newCache
        } = await UrlParser.getDefaultBranch(
          newUrl.owner,
          newUrl.repo,
          cachedRepoToDefaultBranch
        );
        newUrl.defaultBranch = defaultBranch;
        newUrl.cachedRepoToDefaultBranch = newCache;
      }
    }

    // Payload
    newUrl.payloadRepoInfo = {
      url: newUrl.url,
      owner: newUrl.owner,
      repo: newUrl.repo,
      defaultBranch: newUrl.defaultBranch,
      tab: {
        name: newUrl.defaultBranch,
        nodeName: null,
        tabId: newUrl.tabId,
        subpage: newUrl.subpage
      }
    };

    return newUrl;
  }

  parse() {
    if (!this.isGithubRepoUrl) return false;

    if (this.subpage === SUBPAGES.Repository) {
      return this.#handleRepositorySubpage();
    }
    if (this.subpage === SUBPAGES.Issues) {
      return this.#handleIssuesSubpage();
    }
    if (this.subpage === SUBPAGES.Pulls) {
      return this.#handlePullsSubpage();
    }
    if (this.subpage === SUBPAGES.Actions) {
      return this.#handleActionsSubpage();
    }
    if (this.subpage === SUBPAGES.Projects) {
      return this.#handleProjectsSubpage();
    }
    if (this.subpage === SUBPAGES.Wiki) {
      return this.#handleWikiSubpage();
    }
    if (this.subpage === SUBPAGES.Security) {
      return this.#handleSecuritySubpage();
    }
    if (this.subpage === SUBPAGES.Pulse) {
      return this.#handlePulseSubpage();
    }
    if (this.subpage === SUBPAGES.Settings) {
      return this.#handleSettingsSubpage();
    }

    return this.payloadRepoInfo;
  }

  static getDefaultBranch = async (owner, repo, cachedRepoToDefaultBranch) => {
    const key = `${owner}:${repo}`;

    if (cachedRepoToDefaultBranch.has(key)) {
      return {
        defaultBranch: cachedRepoToDefaultBranch.get(key),
        cachedRepoToDefaultBranch
      };
    }

    // Get api key from storage
    const { apiKey } = await browser.storage.sync.get(['apiKey']);
    if (!apiKey) {
      log.error('Cannot get default branch because user is not logged in.');
      throw new UserError('User is not logged in.');
    }

    const response = await graphql.defaults({
      headers: {
        authorization: `token ${apiKey}`
      }
    })(
      `
        query GetRepositorySpecificBranchRootNodes($owner: String!, $repo: String!) {
          repository(owner: $owner, name: $repo) {
            defaultBranchRef {
              name
            }
          }
        }
      `,
      {
        owner,
        repo
      }
    );
    const defaultBranch = response?.repository?.defaultBranchRef?.name;

    // Cache it
    cachedRepoToDefaultBranch.set(key, defaultBranch);
    return { defaultBranch, cachedRepoToDefaultBranch };
  };

  #getSubpage = () => {
    // Handle repository specific subpages first
    if (Object.values(SUBPAGES).includes(this.parsedRepoInfo[2])) {
      return this.parsedRepoInfo[2];
    }
    // Handle github global subpages first (like user settings)
    if (Object.values(GLOBAL_SUBPAGES).includes(this.parsedRepoInfo[0])) {
      return this.parsedRepoInfo[0];
    }
    // Handle repository subpage
    if (
      this.parsedRepoInfo.length === 2 ||
      (this.parsedRepoInfo.length >= 3 &&
        ['tree', 'blob'].includes(this.parsedRepoInfo[2]))
    ) {
      return SUBPAGES.Repository;
    }
    // For some reason, github doesn't pluralize `pull` when on a specific
    // pull request page, like it does with `issues`. Catch this exception
    // ungracefully here.
    if (this.parsedRepoInfo[2] === 'pull') {
      return SUBPAGES.Pulls;
    }
    return 'other';
  };

  // [owner, repo, tree?/blob?, filePath?[*?/*]]
  #handleRepositorySubpage = () => {
    const isRootMaster =
      this.parsedRepoInfo.length === 2 ||
      (this.parsedRepoInfo.length === 4 &&
        ['master', 'main'].includes(this.parsedRepoInfo[3]));

    if (isRootMaster) {
      return {
        ...this.payloadRepoInfo,
        tab: {
          name: this.defaultBranch, // field reserved for branchName
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
    // Get everything in between " at " and " . "; if empty, rest of url is branch name (/'s and all)
    const branchName = (() => {
      if (this.title.includes('Page not found')) {
        return this.defaultBranch;
      }
      if (regexedTitle) {
        return regexedTitle[1];
      }
      return this.parsedRepoInfo.slice(3).join('/');
    })();
    const parsedWithoutBranch = this.urlObject.pathname
      .slice(1)
      .replace(`/${branchName}`, '') // remove branch from url to get
      .split('/'); // [alexkim205, tomaso, tree?/blob?, filePath?[*?/*]]
    const parsedFilePath = (() => {
      if (this.title.includes('Page not found')) {
        return '';
      }
      return parsedWithoutBranch.slice(3).join('/');
    })();
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
          name: this.defaultBranch,
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
          name: this.defaultBranch,
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
          name: this.defaultBranch,
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
          name: this.defaultBranch,
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

export const getParsedOpenRepositories = async () => {
  const windows = await browser.windows.getAll({
    windowTypes: ['normal'],
    populate: true
  });

  // Check if there's global repo default cache in storage
  const {
    globallyCachedDefaultBranches: _globalCache
  } = await browser.storage.sync.get(['globallyCachedDefaultBranches']);
  const globallyCachedDefaultBranches =
    _globalCache instanceof Object
      ? new Map(Object.entries(_globalCache))
      : undefined;

  // Chain promises so that synchronous url parsing can use cache effectively
  // Contains array of [parsed object, defaultbranch cache]
  const openTabsWithCache = (
    await windows
      .map(({ tabs }) => tabs)
      .flat()
      .reduce(async (currentArray, { id, url, title }) => {
        const arr = await currentArray;
        const lastCachedRepo = arr[arr.length - 1][1];
        const parsedUrl = await UrlParser.build(url, title, id, lastCachedRepo);
        return Promise.resolve([
          ...arr,
          [parsedUrl.parse(), parsedUrl.cachedRepoToDefaultBranch]
        ]);
      }, Promise.resolve([[false, globallyCachedDefaultBranches]]))
  ).filter((parsedTuple) => !!parsedTuple[0]);

  if (openTabsWithCache.length === 0) {
    return [];
  }

  // Grab just list of parsed urls
  const openTabs = openTabsWithCache.map((parsedTuple) => parsedTuple[0]);

  // Set global cache
  await browser.storage.sync.set({
    globallyCachedDefaultBranches: Object.fromEntries(
      new Map([
        ...(globallyCachedDefaultBranches instanceof Map
          ? globallyCachedDefaultBranches
          : new Map()),
        ...openTabsWithCache[openTabsWithCache.length - 1][1]
      ])
    )
  });

  return openTabs;
};

export const sendActiveTabChanged = async (tab) => {
  // Check if there's global repo default cache in storage
  const {
    globallyCachedDefaultBranches: _globalCache
  } = await browser.storage.sync.get(['globallyCachedDefaultBranches']);
  const globallyCachedDefaultBranches =
    _globalCache instanceof Object
      ? new Map(Object.entries(_globalCache))
      : undefined;

  const parsed = (
    await UrlParser.build(
      isBlank(tab.url) ? tab.pendingUrl : tab.url, // if tab is currently pending
      tab.title,
      tab.id,
      globallyCachedDefaultBranches
    )
  ).parse();

  // If it's not a github repo, don't send active tab changed event
  if (Object.keys(parsed).length === 0) {
    log.debug('Not a github url');
    return;
  }

  const response = {
    action: 'active-tab-changed',
    payload: {
      ...parsed,
      isGithubRepoUrl: Object.keys(parsed).length !== 0,
      windowId: tab.windowId,
      tabId: tab.id
    }
  };
  await browser.runtime.sendMessage(response).catch((e) => {
    log.warn(
      'Cannot send message because extension is not open',
      e?.message,
      response
    );
  });

  // After active tab changes, inject style script to make sure style
  // stays consistent across tabs
  syncTabStyle(tab.id);
};
