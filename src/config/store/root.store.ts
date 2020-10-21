import IRootStore from './I.root.store';
import UiStore from './ui.store';
import IUiStore from './I.ui.store';
import FileStore from './file.store';
import IFileStore from './I.file.store';
import UserStore from './user.store';
import IUserStore from './I.user.store';

export class RootStore implements IRootStore {
  uiStore: IUiStore;
  fileStore: IFileStore;
  userStore: IUserStore;

  constructor() {
    this.uiStore = new UiStore();
    this.userStore = new UserStore(this);
    this.fileStore = new FileStore(this);
  }
}

const rootStore: IRootStore = new RootStore();

export default rootStore;
