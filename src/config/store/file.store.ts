import { observable, computed } from 'mobx';
import { IUiStore } from './ui.store';
import { IRootStore } from './root.store';
import { IUserStore } from './user.store';

enum NodeType {
  File,
  Folder
}

interface Node {
  id: string;
  name: string;
  type: NodeType;
  sha: string;
  isOpen?: boolean;
}

export interface IFileStore {
  uiStore: IUiStore;
  userStore: IUserStore;
  nodes: Node[];
  openFiles: Node[];
  isPending: boolean;
}

export default class FileStore implements IFileStore {
  uiStore: IUiStore;

  userStore: IUserStore;

  @observable.shallow nodes: Node[] = [];

  @observable.shallow openFiles: Node[] = [];

  @observable isPending: boolean = true;

  constructor(rootStore: IRootStore) {
    this.uiStore = rootStore.uiStore; // Store to update ui state
    this.userStore = rootStore.userStore; // Store that can resolve users

    this.getFiles();
  }

  /**
   * Fetches all files from github repository
   */
  getFiles() {
    this.isPending = true;
    this.uiStore.pendingRequestCount += 1;
    // this.transportLayer.fetchTodos().then((fetchedTodos) => {
    //   fetchedTodos.forEach((json) => this.updateTodoFromServer(json));
    //   this.isLoading = false;
    //   this.uiStore.pendingRequestCount -= 1;
    // });
  }

  setRepositoryFiles(files: any) {
    console.log(files);
  }

  /**
   * Get one file
   */
  getFile(id: string): Node {
    return this.files.find((n) => n.id === id);
  }

  /**
   * Get only files
   */
  @computed get files() {
    return this.nodes.filter((n) => n.type === NodeType.File);
  }

  /**
   * Get only folders
   */
  @computed get folders() {
    return this.nodes.filter((n: Node) => n.type === NodeType.Folder);
  }

  /**
   * Open a file as a new tab.
   */
  openFileTab(id: string): void {
    if (!this.openFiles.filter((n: Node) => n.id === id)) {
      this.openFiles = [...this.openFiles, this.getFile(id)];
    }
  }

  /**
   * Close a file tab.
   */
  closeFileTab(id: string): void {
    const nonmatchingFiles = this.openFiles.filter((n: Node) => n.id !== id);
    if (nonmatchingFiles.length !== this.openFiles.length) {
      // openfiles contains file with this ide
      this.openFiles = nonmatchingFiles;
    }
  }
}
