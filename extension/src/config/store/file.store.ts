import { observable, action } from 'mobx';

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
import {
  getFromChromeStorage,
  setInChromeStorage,
  convertBgRepoToRepo,
  convertBgRepoToTabs
} from './util';
import { STORE_DEFAULTS } from './constants';

export default class FileStore implements IFileStore {
  uiStore: IUiStore;
  userStore: IUserStore;

  @observable isPending: boolean;
  @observable currentWindowTab: WindowTab;
  cachedNodes: Map<string, Node>;
  @observable openRepos: Map<string, Repo>;
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

  @action.bound getNode(
    owner: string,
    repo: string,
    branch: Branch,
    path: string
  ): Node {
    const key = `${owner}:${repo}:${branch.name}:${path}`;
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
    const key = `${owner}:${repo}:${branch.name}:${path}`;
    const foundNode = this.cachedNodes.get(key);
    if (foundNode) {
      this.cachedNodes.set(key, { ...foundNode, isOpen: false });
    }
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

  @action.bound setOpenRepos = (repos: BgRepo[]) => {
    this.cleanupOpenRepos(repos);
    repos.forEach((repo) => this.addOpenRepo(convertBgRepoToRepo(repo)));

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

  @action.bound addOpenRepo = (repo: Repo) => {
    const key = `${repo.owner}:${repo.name}`;
    const foundRepo = this.openRepos.get(key);

    if (!foundRepo) {
      // Create new entry
      this.openRepos.set(key, {
        ...repo,
        tabs: objectMap(repo.tabs, (k: string, v: Tab) => v.tabId),
        isOpen: false
      });
    } else {
      // Add branches to existing repo
      Object.values(repo.tabs).forEach((tab) => {
        const tabKey = tab.tabId;
        foundRepo.tabs[tabKey] = tab;
      });
    }
  };

  @action.bound cleanupOpenRepos = (reposToSet: BgRepo[]) => {
    // Loop through all the open repos and remove the tabs that aren't open
    const openTabIds = new Set(reposToSet.map(({ tab: { tabId } }) => tabId));

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
