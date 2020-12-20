import IUiStore from './I.ui.store';
import IFileStore, { Repo, Session } from './I.file.store';

export enum AccountType {
  Community = 'community',
  Professional = 'professional',
  Enterprise = 'enterprise'
}

export interface User {
  uid: string;
  displayName: string;
  photoURL: string;
  apiKey: string;
  accountType: AccountType;
  email: string;
}

export default interface IUserStore {
  uiStore: IUiStore;
  fileStore: IFileStore;

  user: User;
  userBookmarks: Map<string, Repo>;
  numOfBookmarks: number; // Used for triggering ui changes
  userSessions: Map<string, Session>;
  numOfSessions: number; // Used for triggering ui changes
  isPending: boolean;
  error: Error;
}