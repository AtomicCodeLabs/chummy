import IUiStore from './I.ui.store';
import IFileStore, { Repo, Session } from './I.file.store';
import { ACCOUNT_TYPE } from '../../global/constants';

export interface User {
  uid: string;
  displayName: string;
  photoURL: string;
  apiKey: string;
  accountType: ACCOUNT_TYPE;
  email: string;
  isTrial: boolean;
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
