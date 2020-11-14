import IUiStore from './I.ui.store';
import IFileStore, { Repo } from './I.file.store';

export enum AccountType {
  Basic = 'basic',
  Pro = 'pro',
  Enterprise = 'enterprise'
}

export interface User {
  uid: string;
  displayName: string;
  photoURL: string;
  apiKey: string;
  accountType: AccountType;
}

export default interface IUserStore {
  uiStore: IUiStore;
  fileStore: IFileStore;

  user: User;
  userBookmarks: Map<string, Repo>;
  numOfBookmarks: number; // Used for triggering ui changes
  isPending: boolean;
}
