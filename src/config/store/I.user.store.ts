import IUiStore from './I.ui.store';
import IFileStore from './I.file.store';

export interface User {
  uid: string;
  displayName: string;
  photoURL: string;
  apiKey: string;
}

export default interface IUserStore {
  uiStore: IUiStore;
  fileStore: IFileStore;

  user: User;
  isPending: boolean;
}
