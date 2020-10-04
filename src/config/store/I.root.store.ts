import IUiStore from './I.ui.store';
import IFileStore from './I.file.store';
import IUserStore from './I.user.store';

export default interface IRootStore {
  uiStore: IUiStore;
  fileStore: IFileStore;
  userStore: IUserStore;
}
