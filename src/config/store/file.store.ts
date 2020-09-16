import { observable, computed, values } from 'mobx';
import { IUiStore } from './ui.store';
import { IRootStore } from './root.store';
import { IUserStore } from './user.store';
import { object } from 'prop-types';

enum NodeType {
  File = 'blob',
  Folder = 'tree'
}

interface Node {
  oid: string;
  name: string;
  type: NodeType;
  path: string;
}

export interface IFileStore {
  uiStore: IUiStore;
  userStore: IUserStore;
  nodes: Map<string, Node>;
  openFiles: Node[];
  isPending: boolean;
}

export default class FileStore implements IFileStore {
  uiStore: IUiStore;

  userStore: IUserStore;

  @observable nodes: Map<string, Node> = new Map();

  @observable.shallow openFiles: Node[] = [];

  @observable isPending: boolean = true;

  constructor(rootStore: IRootStore) {
    this.uiStore = rootStore.uiStore; // Store to update ui state
    this.userStore = rootStore.userStore; // Store that can resolve users
  }

  // setRepositoryNodes(files: object[]) {
  //   // Add each node to dictionary for constant time access
  //   files.forEach((n: object, index: number)=>{
  //     // Key will be treeoid
  //     this.nodes.set()
  //   })
  // }

  /**
   * Get one file
   */
  getFile(id: string): Node {
    // @ts-ignore
    return this.files.find((n) => n.id === id);
  }

  /**
   * Get only files
   */
  @computed get files() {
    return values(this.nodes).filter(
      // @ts-ignore
      (n: Node, i: number, a: Node[]) => n.type === NodeType.File
    );
  }

  /**
   * Get only folders
   */
  @computed get folders() {
    // @ts-ignore
    return values(this.nodes).filter((n: Node) => n.type === NodeType.Folder);
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
