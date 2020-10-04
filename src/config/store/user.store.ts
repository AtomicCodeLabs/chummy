import { observable, computed, toJS } from 'mobx';
import { Context, useReducer } from 'react';

import IRootStore from './I.root.store';
import IUserStore, { User } from './I.user.store';
import IUiStore from './I.ui.store';
import IFileStore from './I.file.store';

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
