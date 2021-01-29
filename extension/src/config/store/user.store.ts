import { observable, computed, action } from 'mobx';

import IRootStore from './I.root.store';
import IUserStore, { User } from './I.user.store';
import IUiStore, { SectionName } from './I.ui.store';
import IFileStore, { Bookmark, Repo, Session } from './I.file.store';
import { objectMap } from '../../utils';
import { ACCOUNT_TYPE } from '../../global/constants';

export default class UserStore implements IUserStore {
  uiStore: IUiStore;

  fileStore: IFileStore;

  @observable user: User = null;

  @observable userBookmarks: Map<string, Repo> = new Map(); // key is owner:branchName

  @observable numOfBookmarks: number = 0;

  @observable userSessions: Map<string, Session> = new Map(); // key is session id

  @observable numOfSessions: number = 0;

  @observable isPending: boolean; // keep boolean bc user pending requests are binary

  @observable error: Error = null; // sign in error, null if none

  constructor(rootStore: IRootStore) {
    this.uiStore = rootStore.uiStore; // Store to update ui state
    this.fileStore = rootStore.fileStore; // Store to access file stores
  }

  /** DAO Auth - sync dao with user in store * */

  @action.bound setUser({ user }: { user: User }): void {
    if (!user) {
      this.user = null;
      return;
    }
    const {
      uid = null,
      displayName = null,
      photoURL = null,
      accountType = null,
      apiKey = null,
      email = null
    } = user;
    this.user = {
      uid,
      displayName,
      photoURL,
      email,
      apiKey: apiKey || this.user?.apiKey,
      accountType:
        accountType || this.user?.accountType || ACCOUNT_TYPE.Community
    };
  }

  @action.bound clearUser() {
    this.setUser({ user: null });
    // clear userBookmarks
    this.userBookmarks.clear();
  }

  /** Firebase Firestore - sync user properties in firestore with user store * */

  // userBookmarks
  @action.bound getUserBookmarkRepo = (owner: string, repoName: string) => {
    const key = `${owner}:${repoName}`;
    return this.userBookmarks.get(key);
  };

  @action.bound getUserBookmark = (
    owner: string,
    repoName: string,
    bookmarkId: string
  ) => {
    const key = `${owner}:${repoName}`;
    const repoBookmarks = this.userBookmarks.get(key)?.bookmarks;
    if (!repoBookmarks) return null;
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
        isOpen: true
      });
    } else {
      // Add branches to existing repo
      Object.values(repo.bookmarks).forEach((bookmark) => {
        const bookmarkKey = bookmark.bookmarkId;
        foundRepo.bookmarks[bookmarkKey] = bookmark;
      });
    }

    // Increment
    this.numOfBookmarks += 1;
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

    this.numOfBookmarks = Math.min(0, this.numOfBookmarks - 1);
  }

  @action.bound cleanupUserBookmarks(repoBookmarksToSet: Repo[]) {
    // Loop through all the open repos and remove the tabs that aren't open
    const activeBookmarkIds = new Set();
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
          // Decrement
          this.numOfBookmarks = Math.min(0, this.numOfBookmarks - 1);
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

  // Set all bookmarks repos to open state
  @action.bound openAllUserBookmarksRepos = () => {
    this.userBookmarks.forEach((r: Repo) => {
      const key = `${r.owner}:${r.name}`;
      const foundRepo = this.userBookmarks.get(key);
      if (foundRepo) {
        this.userBookmarks.set(key, { ...foundRepo, isOpen: true });
      }
    });
  };

  // Set all bookmarks repos to closed state
  @action.bound closeAllUserBookmarksRepos = () => {
    this.userBookmarks.forEach((r: Repo) => {
      const key = `${r.owner}:${r.name}`;
      const foundRepo = this.userBookmarks.get(key);
      if (foundRepo) {
        this.userBookmarks.set(key, { ...foundRepo, isOpen: false });
      }
    });
  };

  // userSessions

  @action.bound getUserSession = (sessionId: string) => {
    const foundUserSession = this.userSessions.get(sessionId);
    if (!foundUserSession) return null;
    return foundUserSession;
  };

  @action.bound getUserSessions = (sessionId: string) => {
    return this.userSessions;
  };

  @action.bound setUserSessions = (sessions: Session[]) => {
    this.userSessions.clear();
    sessions.forEach((session) => this.addUserSession(session));
  };

  @action.bound addUserSession = (session: Session) => {
    this.userSessions.set(session.id, session);
    this.numOfSessions += 1;
  };

  @action.bound updateUserSession = (session: Session) => {
    const foundSession = this.userSessions.get(session.id);

    if (foundSession) {
      this.userSessions.set(session.id, { ...foundSession, ...session });
    }
  };

  @action.bound removeUserSession = (sessionId: string) => {
    this.userSessions.delete(sessionId);
    this.numOfSessions = Math.min(0, this.numOfBookmarks - 1);
  };

  /** Util * */
  @action.bound setPending(isPending: boolean): void {
    this.isPending = isPending;
    if (isPending) {
      this.uiStore.addPendingRequest(SectionName.Account);
    } else {
      this.uiStore.removePendingRequest(SectionName.Account);
    }
  }

  @action.bound setError(error: Error): void {
    this.error = error;
  }

  @computed get isLoggedIn() {
    return !!this.user?.apiKey;
  }

  @computed get hasBookmarksCached() {
    return this.userBookmarks.size !== 0;
  }

  @computed get hasBookmarks() {
    return this.numOfBookmarks !== 0;
  }
}
