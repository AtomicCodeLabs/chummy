import { observable, action, toJS } from 'mobx';

import IRootStore from './I.root.store';
import IUiStore from './I.ui.store';
import IUserStore from './I.user.store';
import IFileStore, { Node, Branch, Repo, WindowTab } from './I.file.store';
import { objectMap } from '../../utils';

export default class FileStore implements IFileStore {
  uiStore: IUiStore;
  userStore: IUserStore;
  @observable isPending: boolean = true;

  /* Window/Tab Section */
  currentWindowTab: WindowTab;

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
    // console.log('Setting node', key, foundNode, toJS(this.cachedNodes));
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
    this.openRepos.clear();
    repos.forEach((repo) => this.addOpenRepo(repo));
  };

  @action.bound addOpenRepo = (repo: Repo) => {
    const key = `${repo.owner}:${repo.name}`;
    const foundRepo = this.openRepos.get(key);

    if (!foundRepo) {
      // Create new entry
      this.openRepos.set(key, {
        ...repo,
        branches: objectMap(
          repo.branches,
          (k: string, v: Branch) => `${k}#${v.tabId}`
        )
      });
    } else {
      // Add branches to existing repo
      Object.values(repo.branches).forEach((branch) => {
        const branchKey = `${branch.name}#${branch.tabId}`;
        foundRepo.branches[branchKey] = branch;
      });
    }
  };

  @action.bound removeOpenRepo = (repo: Repo) => {
    const key = `${repo.owner}:${repo.name}`;
    const foundRepo = this.openRepos.get(key);

    if (foundRepo) {
      // Remove branches from existing repo
      Object.values(repo.branches).forEach((branch) => {
        const branchKey = `${branch.name}#${branch.tabId}`;
        delete foundRepo.branches[branchKey];
      });
      // If no branches left, remove open repo entry
      if (Object.keys(foundRepo.branches).length === 0) {
        this.openRepos.delete(key);
      }
    }
  };

  // updateOpenRepo = (repo: Repo) => {
  //   const key = `${repo.owner}:${repo.name}`;
  //   const foundRepo = this.openRepos.get(key);
  //   if (foundRepo) {
  //     // Update branches from existing repo
  //     Object.values(repo.branches).forEach((branch) => {
  //       const branchKey = `${branch.name}#${branch.tabId}`;
  //       foundRepo.branches[branchKey] = branch;
  //     });
  //   }
  // };

  @action.bound setCurrentBranch = (branch: Branch) => {
    this.currentBranch = branch;
  };

  openFileTab(id: string): void {}

  closeFileTab(id: string): void {}
}
