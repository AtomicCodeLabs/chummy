import { observable, computed, toJS } from 'mobx';
import { Context, useReducer } from 'react';
import { IUiStore } from './ui.store';
import { IFileStore } from './file.store';
import { IRootStore } from './root.store';

interface User {
  uid: string;
  displayName: string;
  photoURL: string;
  apiKey: string;
}

export interface IUserStore {
  uiStore: IUiStore;
  fileStore: IFileStore;

  user: User;
  isPending: boolean;
}

export default class UserStore implements IUserStore {
  uiStore: IUiStore;
  fileStore: IFileStore;

  @observable user: User;

  @observable isPending: boolean;

  constructor(rootStore: IRootStore) {
    this.uiStore = rootStore.uiStore; // Store to update ui state
    this.fileStore = rootStore.fileStore; // Store to access file stores
  }

  /**
   * Sync user store with firebase auth store.
   */
  setUser({ user, credential }: { user: User; credential?: string }): void {
    if (!user) {
      this.user = null;
      return;
    }
    const { uid = null, displayName = null, photoURL = null } = user;
    this.user = {
      uid,
      displayName,
      photoURL,
      apiKey: credential || this.user?.apiKey
    };
  }

  /**
   * Set pending status
   */
  setPending(isPending: boolean): void {
    this.isPending = isPending;
    this.uiStore.pendingRequestCount += isPending ? 1 : -1;
  }

  /**
   * Is user authenticated?
   */

  @computed get isLoggedIn() {
    return !!this.user;
  }
}
