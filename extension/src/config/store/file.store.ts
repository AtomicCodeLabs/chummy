import { observable, action } from 'mobx';

import IRootStore from './I.root.store';
import IUiStore from './I.ui.store';
import IUserStore from './I.user.store';
import IFileStore, { Node, Branch, Repo, WindowTab, Tab } from './I.file.store';
import { objectMap } from '../../utils';

export default class FileStore implements IFileStore {
  uiStore: IUiStore;

  userStore: IUserStore;

  @observable isPending: boolean = true;

  /* Window/Tab Section */
  @observable currentWindowTab: WindowTab;

  /* Tree Section */
  cachedNodes: Map<string, Node> = new Map();

  @observable openRepos: Map<string, Repo> = new Map();

  @observable currentBranch: Branch;

  /* VCS Section */
  @observable currentRepo: Repo;

  constructor(rootStore: IRootStore) {
    this.uiStore = rootStore.uiStore; // Store to update ui state
    this.userStore = rootStore.userStore; // Store that can resolve users
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

  @action.bound setOpenRepos = (repos: Repo[]) => {
    // this.openRepos.clear();
    this.cleanupOpenRepos(repos);
    repos.forEach((repo) => this.addOpenRepo(repo));
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

  @action.bound cleanupOpenRepos = (reposToSet: Repo[]) => {
    // Loop through all the open repos and remove the tabs that aren't open
    const openTabIds = new Set();
    reposToSet.forEach((r: Repo) =>
      Object.values(r.tabs).forEach((t: Branch) => openTabIds.add(t.tabId))
    );

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

  openFileTab(id: string): void {}

  closeFileTab(id: string): void {}
}
