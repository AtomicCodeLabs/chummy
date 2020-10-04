import IUiStore from './I.ui.store';
import IUserStore from './I.user.store';

export enum NodeType {
  Blob = 'blob',
  Tree = 'tree'
}

export interface Node {
  oid: string;
  name: string;
  type: NodeType;
  path: string;
  children?: Node[];
  repo: Repo;
  branch: Branch;
}

export interface Branch {
  repo?: Repo;
  name: string;
  nodes?: Node[];
  type: NodeType;
  tabId?: number;
}

export interface Repo {
  owner: string;
  name: string;
  branches?: { [key: string]: Branch };
  type: NodeType;
}

export interface WindowTab {
  windowId: number;
  tabId: number;
}

export default interface IFileStore {
  uiStore: IUiStore;
  userStore: IUserStore;
  isPending: boolean;

  /* Tab Management */
  currentWindowTab: WindowTab;

  /* Tree Section */

  /* Map to store all nodes. Used to fetch nodes in constant time.
   * Every node in this map will be shallow (1 level deep)
   *
   * <key> owner:repo:branch:nodePath
   * i.e alexkim205:HelloWorld:master:frontend/hello-world.js
   * <value> Node
   */
  cachedNodes: Map<string, Node>;
  openRepos: Map<string, Repo>;
  currentBranch: Branch; // Branch to show in files section (active tab)

  /* VCS Section */
  currentRepo: Repo;
}
