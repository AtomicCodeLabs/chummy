import { observable, computed, action } from 'mobx';

import IRootStore from './I.root.store';
import IUserStore, { AccountType, User } from './I.user.store';
import IUiStore from './I.ui.store';
import IFileStore, { Bookmark, Repo } from './I.file.store';
import { objectMap } from '../../utils';

export default class UserStore implements IUserStore {
  uiStore: IUiStore;
  fileStore: IFileStore;

  @observable user: User = null;
  @observable userBookmarks: Map<string, Repo> = new Map(); // key is owner:branchName

  @observable isPending: boolean;

  constructor(rootStore: IRootStore) {
    this.uiStore = rootStore.uiStore; // Store to update ui state
    this.fileStore = rootStore.fileStore; // Store to access file stores
  }

  /** Firebase Auth - sync firebase with user in store **/

  @action.bound setUser({
    user,
    credential
  }: {
    user: User;
    credential?: string;
  }): void {
    if (!user) {
      this.user = null;
      return;
    }
    const {
      uid = null,
      displayName = null,
      photoURL = null,
      accountType = null
    } = user;
    this.user = {
      uid,
      displayName,
      photoURL,
      apiKey: credential || this.user?.apiKey,
      accountType: accountType || this.user?.accountType || AccountType.Basic
    };
  }

  @action.bound clearUser() {
    this.setUser({ user: null });
    // clear userBookmarks
    this.userBookmarks.clear();
  }

  /** Firebase Firestore - sync user properties in firestore with user store **/

  @action.bound getUserBookmarkRepo = (owner: string, repoName: string) => {
    const key = `${owner}:${repoName}`;
    return this.userBookmarks.get(key)?.bookmarks;
  };

  @action.bound getUserBookmark = (
    owner: string,
    repoName: string,
    bookmarkId: string
  ) => {
    const key = `${owner}:${repoName}`;
    const repoBookmarks = this.userBookmarks.get(key)?.bookmarks;
    if (!repoBookmarks) return;
    return repoBookmarks[bookmarkId];
  };

  @action.bound getUserBookmarks = () => {
    return this.userBookmarks;
  };

  @action.bound setUserBookmarks(repos: Repo[]) {
    this.cleanupUserBookmarks(repos);
    repos.forEach((repo) => this.addBookmark(repo));
  }

  @action.bound addBookmark(repo: Repo) {
    const key = `${repo.owner}:${repo.name}`;
    const foundRepo = this.userBookmarks.get(key);

    if (!foundRepo) {
      // Create new entry
      this.userBookmarks.set(key, {
        ...repo,
        bookmarks: objectMap(
          repo.bookmarks,
          (k: string, v: Bookmark) => v.bookmarkId
        ),
        isOpen: false
      });
    } else {
      // Add branches to existing repo
      Object.values(repo.bookmarks).forEach((bookmark) => {
        const bookmarkKey = bookmark.bookmarkId;
        foundRepo.bookmarks[bookmarkKey] = bookmark;
      });
    }
  }

  @action.bound removeBookmark(repo: Repo) {
    const key = `${repo.owner}:${repo.name}`;
    const foundRepo = this.userBookmarks.get(key);

    if (foundRepo) {
      // Remove branches from existing repo
      Object.values(repo.bookmarks).forEach((bookmark) => {
        const bookmarkKey = bookmark.bookmarkId;
        delete foundRepo.bookmarks[bookmarkKey];
      });
      // If no branches left, remove open repo entry
      if (Object.keys(foundRepo.bookmarks).length === 0) {
        this.userBookmarks.delete(key);
      }
    }
  }

  @action.bound cleanupUserBookmarks(repoBookmarksToSet: Repo[]) {
    // Loop through all the open repos and remove the tabs that aren't open
    let activeBookmarkIds = new Set();
    repoBookmarksToSet.forEach((r: Repo) =>
      Object.values(r.bookmarks).forEach((b: Bookmark) =>
        activeBookmarkIds.add(b.bookmarkId)
      )
    );

    this.userBookmarks.forEach((r: Repo) =>
      Object.values(r.bookmarks).forEach((b: Bookmark) => {
        if (!activeBookmarkIds.has(b.bookmarkId)) {
          const repoKey = `${r.owner}:${r.name}`;
          // If not an active bookmark, remove it.
          delete this.userBookmarks.get(repoKey).bookmarks[b.bookmarkId];
          // If no bookmarks left, remove open repo entry.
          if (
            Object.keys(this.userBookmarks.get(repoKey).bookmarks).length === 0
          ) {
            this.userBookmarks.delete(repoKey);
          }
        }
      })
    );
  }

  // Set bookmarks repo to open state (expanded)
  @action.bound openUserBookmarksRepo = (owner: string, repoName: string) => {
    const key = `${owner}:${repoName}`;
    const foundRepo = this.userBookmarks.get(key);
    if (foundRepo) {
      this.userBookmarks.set(key, { ...foundRepo, isOpen: true });
    }
  };

  // Set bookmarks repo to closed state (minimized)
  @action.bound closeUserBookmarksRepo = (owner: string, repoName: string) => {
    const key = `${owner}:${repoName}`;
    const foundRepo = this.userBookmarks.get(key);
    if (foundRepo) {
      this.userBookmarks.set(key, { ...foundRepo, isOpen: false });
    }
  };

  /** Util **/
  @action.bound setPending(isPending: boolean): void {
    this.isPending = isPending;
    this.uiStore.pendingRequestCount += isPending ? 1 : -1;
  }

  @computed get isLoggedIn() {
    return !!this.user;
  }

  @computed get hasBookmarksCached() {
    return !!this.userBookmarks;
  }
}
