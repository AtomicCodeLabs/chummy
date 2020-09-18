import { observable, toJS } from 'mobx';
import { IUiStore } from './ui.store';
import { IRootStore } from './root.store';
import { IUserStore } from './user.store';
import Node from '../../components/Node';

enum NodeType {
  File = 'blob',
  Folder = 'tree',
  Root = 'root'
}

interface Node {
  oid: string;
  name: string;
  type: NodeType;
  path: string;
  children?: Node[];
}

export interface IFileStore {
  uiStore: IUiStore;
  userStore: IUserStore;

  /* Map to store only root nodes. There may be multiple for different branches */
  rootNodeKeys: Map<string, string>;

  /* Map to store all nodes. Used to fetch nodes in constant time.
   * <key> branch:nodePath i.e HEAD/frontend/hello-world.js
   * <value> Node
   */
  nodes: Map<string, Node>;

  openFiles: Node[];
  isPending: boolean;
}

export default class FileStore implements IFileStore {
  uiStore: IUiStore;

  userStore: IUserStore;

  @observable rootNodeKeys: Map<string, string> = new Map();

  @observable nodes: Map<string, Node> = new Map();

  @observable.shallow openFiles: Node[] = [];

  @observable isPending: boolean = true;

  constructor(rootStore: IRootStore) {
    this.uiStore = rootStore.uiStore; // Store to update ui state
    this.userStore = rootStore.userStore; // Store that can resolve users
  }

  setRepositoryNodes(branch: string, parent: Node, files: Node[]) {
    // Add parent node to rootNodes if it's a root node.
    if (parent.type === NodeType.Root) {
      this.rootNodeKeys.set(branch, `${branch}:`);
    }

    // Add parent node to nodes if it doesn't exist yet, else just add children
    const foundNode = this.nodes.get(`${branch}:${parent.path}`);
    if (foundNode) {
      this.nodes.set(`${branch}:${parent.path}`, {
        ...foundNode,
        children: files
      });
    } else {
      this.nodes.set(`${branch}:${parent.path}`, parent);
    }

    // Add children nodes to map
    files.forEach((n: Node, i: number) => {
      this.nodes.set(`${branch}:${n.path}`, n);
    });

    // console.log('After adding to maps', this.getRootNodes(), toJS(this.nodes));
  }

  /**
   * Get only root level nodes
   */
  getRootNodes() {
    let rootNodes: Node[] = [];
    this.nodes.forEach((n: Node, key: string) => {
      if (key.match(/^[^:]*(:\s*)$/g)) {
        // regex matches for nothing after colon (:)
        rootNodes.push(n);
      }
    });
    return rootNodes;
  }

  /**
   * Clear map
   */
  clearNodes = () => {
    this.nodes.clear();
  };

  /**
   * Get a node
   * @param branch
   * @param path
   */
  getNode(branch: string, path: string): Node {
    return this.nodes.get(`${branch}:${path}`);
  }

  /**
   * Open a file as a new tab.
   */
  openFileTab(id: string): void {}

  /**
   * Close a file tab.
   */
  closeFileTab(id: string): void {}
}
