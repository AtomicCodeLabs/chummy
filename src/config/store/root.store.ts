import UiStore, { IUiStore } from './ui.store';
import FileStore, { IFileStore } from './file.store';
import UserStore, { IUserStore } from './user.store';

export interface IRootStore {
  uiStore: IUiStore;
  fileStore: IFileStore;
  userStore: IUserStore;
}

export class RootStore implements IRootStore {
  uiStore: IUiStore;
  fileStore: IFileStore;
  userStore: IUserStore;

  constructor() {
    this.uiStore = new UiStore(this);
    this.userStore = new UserStore(this);
    this.fileStore = new FileStore(this);
  }
}

const rootStore: IRootStore = new RootStore();

export default rootStore;
