import IUiStore from './I.ui.store';
import IUserStore from './I.user.store';

export enum NodeType {
  Blob = 'blob',
  Tree = 'tree',
}

export enum SubpageType {
  REPOSITORY = 'repository',
  ISSUES = 'issues',
  PULLS = 'pulls',
  ACTIONS = 'actions',
  PROJECTS = 'projects',
  WIKI = 'wiki',
  SECURITY = 'security',
  PULSE = 'pulse',
  SETTINGS = 'settings'
}

export interface Node {
  oid: string;
  name: string;
  type: NodeType;
  path: string;
  children?: Node[];
  repo: Repo;
  branch: Branch;
  isOpen?: boolean;
}

export interface Bookmark extends Node {
  bookmarkId: string;
  pinned?: boolean;
}

export interface Tab {
  name: string;
  tabId: number;
  tabTitle?: string;
}

export interface Repo {
  owner: string;
  name: string;
  tabs?: { [key: string]: Tab };
  bookmarks?: { [key: string]: Bookmark };
  type: NodeType;
  isOpen?: boolean;
}

export interface Branch extends Tab {
  repo?: Repo;
  name: string;
  nodes?: Node[];
  type?: NodeType;
  subpage: SubpageType;

  // For currentBranch with tab information for openRepos
  nodeName?: string;
}

export interface PullRequest extends Tab {
  repo?: Repo;
  author?: string;
  subpage: SubpageType;
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

  /* Search Section */
  openSearchResultFiles: Set<string>;

  /* VCS Section */
  currentRepo: Repo;
}
