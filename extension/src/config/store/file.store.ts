/* eslint-disable func-names */
import { observable, action, toJS } from 'mobx';

import IRootStore from './I.root.store';
import IUiStore from './I.ui.store';
import IUserStore from './I.user.store';
import IFileStore, {
  FileStoreKeys,
  FileStorePropsArray,
  Node,
  Branch,
  Repo,
  WindowTab,
  Tab,
  BgRepo,
  Session
} from './I.file.store';
import { objectMap } from '../../utils';
import { getMaxOpenTabLimit } from '../../utils/throttling';
import {
  getFromChromeStorage,
  setInChromeStorage,
  convertBgRepoToRepo,
  convertBgRepoToTabs
} from './util';
import { STORE_DEFAULTS } from './constants';
import { ThrottlingError } from '../../global/errors';
import OperationLimits from '../../global/limits/operations';
import { ACCOUNT_TYPE, THROTTLING_OPERATION } from '../../global/constants';
import log from '../log';

export default class FileStore implements IFileStore {
  uiStore: IUiStore;
  userStore: IUserStore;

  @observable isPending: boolean;
  @observable currentWindowTab: WindowTab;
  @observable cachedNodes: Map<string, Node>;
  @observable openRepos: Map<string, Repo>;
  @observable lastNOpenTabIds: Set<number>;
  @observable currentBranch: Branch;
  @observable currentSession: Session;
  @observable currentRepo: Repo;

  static ALLOWLISTED_KEYS = ['currentSession'];

  constructor(rootStore: IRootStore) {
    this.uiStore = rootStore.uiStore; // Store to update ui state
    this.userStore = rootStore.userStore; // Store that can resolve users
    this.init();
  }

  // Initialize
  @action.bound init = () => {
    // Set defaults
    Object.entries(STORE_DEFAULTS.FILE).forEach(([key, value]) => {
      // @ts-ignore: Hard to type
      this[key] = value;
    });

    // Get keys of IUiStore
    const keys: FileStorePropsArray = FileStoreKeys;

    // Keep some keys out of chrome storage
    const filteredKeys = keys
      .filter((k) => !FileStore.ALLOWLISTED_KEYS.includes(k))
      .sort();

    // Get and set previous sessions' settings
    getFromChromeStorage(filteredKeys, (items: { [key: string]: any }) => {
      // Set each key
      filteredKeys.forEach((key) => {
        if (items[key]) {
          // @ts-ignore: Hard to type
          this[key] = items[key];
        }
      });

      // Set defaults but don't overwrite previous
      setInChromeStorage(
        filteredKeys.reduce((o, key) => ({ ...o, [key]: this[key] }), {})
      );
    });
  };

  @action.bound clear() {
    // Set defaults
    Object.entries(STORE_DEFAULTS.FILE).forEach(([key, value]) => {
      // @ts-ignore: Hard to type
      this[key] = value;
    });
    // Set defaults in store
    setInChromeStorage(
      Object.keys(STORE_DEFAULTS.FILE).reduce(
        (o, key) => ({ ...o, [key]: STORE_DEFAULTS.FILE[key] || null }),
        {}
      )
    );
  }

  @action.bound setNode(node: Node) {
    // Add parent node to nodes if it doesn't exist yet, else just add children
    const key = `${node.repo.owner}:${node.repo.name}:${node.branch.name}:${node.path}`;
    const foundNode = this.cachedNodes.get(key);
    if (!foundNode) {
      this.cachedNodes.set(key, node);
    } else {
      // If it was already added, preserve open state
      this.cachedNodes.set(key, { ...node, isOpen: foundNode.isOpen });
    }
    // Add skeleton children to keep track of open state
    node.children.forEach((childNode) => {
      this.cachedNodes.set(
        `${node.repo.owner}:${node.repo.name}:${node.branch.name}:${childNode.path}`,
        { ...childNode, isOpen: false }
      );
    });
  }

  static getNodeKey(
    owner: string,
    repo: string,
    branch: string,
    path: string
  ): string {
    return `${owner}:${repo}:${branch}:${path}`;
  }

  @action.bound getNode(
    owner: string,
    repo: string,
    branch: Branch,
    path: string
  ): Node {
    const key = FileStore.getNodeKey(owner, repo, branch.name, path);
    return this.cachedNodes.get(key);
  }

  @action.bound openNode(
    owner: string,
    repo: string,
    branch: Branch,
    path: string
  ): void {
    const key = `${owner}:${repo}:${branch.name}:${path}`;
    const foundNode = this.cachedNodes.get(key);
    if (foundNode) {
      this.cachedNodes.set(key, { ...foundNode, isOpen: true });
    }
  }

  @action.bound closeNode(
    owner: string,
    repo: string,
    branch: Branch,
    path: string
  ): void {
    const key = FileStore.getNodeKey(owner, repo, branch.name, path);
    const foundNode = this.cachedNodes.get(key);
    if (foundNode && foundNode.isOpen) {
      this.cachedNodes.set(key, { ...foundNode, isOpen: false });
    }
  }

  @action.bound closeAllNodesBelow(
    owner: string,
    repo: string,
    branch: Branch,
    path: string
  ): void {
    const key = `${owner}:${repo}:${branch.name}:${path}`;
    const foundNode = this.cachedNodes.get(key);

    if (foundNode) {
      // traverse through all nodes under this root and close them
      this.traverseNode(foundNode, (childNode: Node) => {
        if (childNode?.type === 'tree') {
          this.closeNode(owner, repo, branch, childNode?.path);
        }
      });
    }
  }

  @action.bound traverseNode(
    node: Node,
    callback = (callNode: Node) => {
      console.log(callNode);
    }
  ) {
    node?.children?.forEach((childNode: Node) => {
      const childNodeKey = FileStore.getNodeKey(
        node.repo.owner,
        node.repo.name,
        node.branch.name,
        childNode.path
      );
      const foundChildNode = this.cachedNodes.get(childNodeKey);
      if (foundChildNode?.type === 'tree') {
        this.traverseNode(foundChildNode, callback);
      }
      // Callback happens after traversal
      callback(childNode);
    });
  }

  @action.bound clearCachedNodes = () => {
    this.cachedNodes.clear();
  };

  @action.bound setCurrentWindowTab = (windowId: number, tabId: number) => {
    this.currentWindowTab = {
      windowId,
      tabId
    };
  };

  @action.bound setOpenRepos = (repos: BgRepo[], isAdding = true) => {
    this.cleanupOpenRepos(repos);

    const prevNumOpenTabs = this.lastNOpenTabIds.size;

    const numTabsAdded = repos.reduce(
      (totalNewTabsAdded, repo) =>
        totalNewTabsAdded + this.addOpenRepo(convertBgRepoToRepo(repo)),
      0
    );

    // Before adding new repository tabs, send a notification if we're adding more than the throttle limit
    if (
      isAdding &&
      !!this.userStore.user?.apiKey && // checks if user is logged in - for some reason isLoggedIn cannot be typed correctly
      prevNumOpenTabs + numTabsAdded > getMaxOpenTabLimit(this.userStore.user)
    ) {
      this.uiStore.addWarningPendingNotification(
        new ThrottlingError(
          `The maximum number of tabs for your tier has been reached. Only the last ${
            OperationLimits[THROTTLING_OPERATION.CreateBookmark][
              ACCOUNT_TYPE.Community
            ]
          } tabs will be kept.`
        )
      );
    }

    // Set current session every time openrepos is called. Since current sessions
    // should also hold the last session the user had open, don't call this if repos
    // is empty
    if (repos.length !== 0) {
      this.setCurrentSession(repos);
    }
  };

  @action.bound getOpenRepo = (owner: string, name: string) => {
    const key = `${owner}:${name}`;
    return this.openRepos.get(key);
  };

  @action.bound addOpenRepo = (repo: Repo): number => {
    const key = `${repo.owner}:${repo.name}`;
    const foundRepo = this.openRepos.get(key);

    let tabsToAdd: Set<number> = new Set();

    if (!foundRepo) {
      // Create new repo entry
      this.openRepos.set(key, {
        ...repo,
        tabs: objectMap(repo.tabs, (k: string, v: Tab) => v.tabId),
        isOpen: false
      });
      tabsToAdd = new Set(Object.values(repo.tabs).map((t) => t.tabId));
      log.debug('REPO NOT FOUND', toJS(tabsToAdd));
    } else {
      // Add branches to existing repo
      Object.values(repo.tabs).forEach((tab) => {
        const tabKey = tab.tabId;
        if (foundRepo.tabs[tabKey] === undefined) {
          // If tab exists don't add
          tabsToAdd.add(tabKey);
        }
        foundRepo.tabs[tabKey] = tab;
      });
    }

    // Append recently added repo tab ids to lastNOpenTabIds
    const lastNCopy = this.lastNOpenTabIds;
    this.lastNOpenTabIds = new Set(
      (function* () {
        yield* lastNCopy;
        yield* tabsToAdd;
      })()
    );

    // Throttle number of open repos at any one time according to account type
    // by removing first N + A - T tabs (N is number of open tabs, A is the number of tabs to add,
    // in this method, and T is max number allowed)
    const tabLimit = getMaxOpenTabLimit(this.userStore.user);

    // Before adding new repository tabs, send a notification if we're adding more than the throttle limit
    // if (this.lastNOpenTabIds.size + Object.keys(repo.tabs).length > tabLimit) {
    //   this.uiStore.addErrorPendingNotification(
    //     new ThrottlingError(
    //       'The maximum number of tabs for your tier has been reached. Upgrade to Professional!'
    //     )
    //   );
    // }

    // Set to last N elements
    this.lastNOpenTabIds = new Set(
      [...this.lastNOpenTabIds].slice(
        Math.max(this.lastNOpenTabIds.size - tabLimit, 0)
      )
    );

    // Lastly prune out the open repos that were throttled
    this.openRepos.forEach((r: Repo) =>
      Object.values(r.tabs).forEach((t: Tab) => {
        if (!this.lastNOpenTabIds.has(t.tabId)) {
          const repoKey = `${r.owner}:${r.name}`;
          // If throttled, remove it.
          delete this.openRepos.get(repoKey).tabs[t.tabId];
          // If no tabs left, remove open repo entry.
          if (Object.keys(this.openRepos.get(repoKey).tabs).length === 0) {
            this.openRepos.delete(repoKey);
          }
        }
      })
    );

    // Return number of new tabs added
    return tabsToAdd.size;
  };

  @action.bound cleanupOpenRepos = (reposToSet: BgRepo[]) => {
    // Loop through all the open repos and remove the tabs that aren't open
    const openTabIds = new Set(reposToSet.map(({ tab: { tabId } }) => tabId));
    this.lastNOpenTabIds = new Set();

    this.openRepos.forEach((r: Repo) =>
      Object.values(r.tabs).forEach((t: Tab) => {
        if (!openTabIds.has(t.tabId)) {
          const repoKey = `${r.owner}:${r.name}`;
          // If not an open tab, remove it.
          delete this.openRepos.get(repoKey).tabs[t.tabId];
          // If no tabs left, remove open repo entry.
          if (Object.keys(this.openRepos.get(repoKey).tabs).length === 0) {
            this.openRepos.delete(repoKey);
          }
        } else {
          // Keep and add to lastNOpenTabIds. Include repo data
          this.lastNOpenTabIds.add(t.tabId);
        }
      })
    );
  };

  @action.bound removeOpenRepoTab = (repo: Repo) => {
    const key = `${repo.owner}:${repo.name}`;
    const foundRepo = this.openRepos.get(key);

    if (foundRepo) {
      // Remove branches from existing repo
      Object.values(repo.tabs).forEach((tab) => {
        const tabKey = tab.tabId;
        delete foundRepo.tabs[tabKey];
      });
      // If no branches left, remove open repo entry
      if (Object.keys(foundRepo.tabs).length === 0) {
        this.openRepos.delete(key);
      }
    }
  };

  // Set open repo to open state (expanded)
  @action.bound openOpenRepo = (owner: string, name: string) => {
    const key = `${owner}:${name}`;
    const foundRepo = this.openRepos.get(key);
    if (foundRepo) {
      this.openRepos.set(key, { ...foundRepo, isOpen: true });
    }
  };

  // Set open repo to closed state (minimized)
  @action.bound closeOpenRepo = (owner: string, name: string) => {
    const key = `${owner}:${name}`;
    const foundRepo = this.openRepos.get(key);
    if (foundRepo) {
      this.openRepos.set(key, { ...foundRepo, isOpen: false });
    }
  };

  @action.bound setCurrentBranch = (branch: Branch) => {
    this.currentBranch = branch;
  };

  @action.bound setCurrentSession = (repos: BgRepo[]) => {
    this.currentSession = {
      id: `session-${repos.length}`,
      name: 'session', // make this editable in the future by the user
      tabs: convertBgRepoToTabs(repos)
    };

    // Set in storage
    setInChromeStorage({ currentSession: this.currentSession });
  };
}
