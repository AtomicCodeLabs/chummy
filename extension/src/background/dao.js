import Amplify, { API, Auth } from 'aws-amplify';
import browser from 'webextension-polyfill';

import 'regenerator-runtime/runtime'; // for async/await to work
import 'core-js/stable'; // or a more selective import such as "core-js/es/array"

import awsExports from '../aws-exports';
// import * as queries from '../graphql/queries';
// import * as mutations from '../graphql/mutations';
// import * as subscriptions from '../graphql/subscriptions';

import { isCurrentWindow, isExtensionOpen } from './util';
import { AccountType, APP_URLS } from './constants.ts';

console.log('HALLO');

class DAO {
  constructor() {
    // Initialize firebase in background script
    try {
      Amplify.configure(awsExports);
      this.graphql = API.graphql;
      this.auth = Auth;
    } catch (error) {
      console.warn('Error configuring DAO', error);
      return;
    }

    // Additional properties on this.auth.currentUser
    this.githubApiKey = null; // Keep API key to make requests with on hand
    this.accountType = null; // Keep accountType to know which request user is allowed to make
    this.bookmarks = [];
    this.listeners = null;

    // If user hasn't signed out yet, apiKey will still be in
    // chrome storage. Use that for future requests.
    browser.storage.sync.get(['apiKey']).then((items) => {
      if (items.apiKey) {
        this.setGithubApiKey(items.apiKey);
      }
    });

    // Subscribe only once
    if (!this.listeners) {
      this.subscribeListeners(); // Will get initialized on extension open
    }
  }

  // *** Listeners ***
  // Expose firebase Auth API that content script can query

  cleanupAuthListener = (request) => {
    if (['sign-in', 'sign-out', 'get-current-user'].includes(request.action)) {
      return (async () => {
        // Sign In
        if (request.action === 'sign-in') {
          let success = false;
          let payload;
          let error;
          try {
            await this.signInWithGithub();
            payload = this.getCurrentUser();
            success = true;
          } catch (e) {
            error = e;
          }
          return {
            action: request.action,
            ...(success ? { payload } : { error })
          };
        }
        // Sign Out
        if (request.action === 'sign-out') {
          this.signOut();
          return null;
        }
        // Get current user
        if (request.action === 'get-current-user') {
          return {
            action: request.action,
            payload: this.getCurrentUser()
          };
        }
        return null;
      })(request);
    }
  };

  // Expose firestore API that content script can query
  cleanupDataListener = (request) => {
    if (
      [
        'get-bookmarks',
        'update-bookmark',
        'create-bookmark',
        'remove-bookmark'
      ].includes(request.action)
    ) {
      return (async () => {
        // Get current user's bookmarks
        if (request.action === 'get-bookmarks') {
          let success = false;
          let payload;
          let error;
          try {
            payload = await this.getAllBookmarks();
            success = true;
          } catch (e) {
            error = e;
            console.warn(`Error handling ${request.action} action`, e);
          }
          return {
            action: request.action,
            ...(success ? { payload } : { error })
          };
        }
        // Update a bookmark
        if (request.action === 'update-bookmark') {
          try {
            await this.updateBookmark(request.payload);
          } catch (e) {
            console.warn(`Error handling ${request.action} action`, e);
          }
          return null;
        }
        // Create a bookmark
        if (request.action === 'create-bookmark') {
          try {
            await this.createBookmark(request.payload);
          } catch (e) {
            console.warn(`Error handling ${request.action} action`, e);
          }
          return null;
        }
        // Remove a bookmark
        if (request.action === 'remove-bookmark') {
          try {
            await this.removeBookmark(request.payload);
          } catch (e) {
            console.warn(`Error handling ${request.action} action`, e);
          }
          return null;
        }
        return null;
      })(request);
    }
  };

  subscribeListeners = () => {
    browser.runtime.onMessage.addListener(this.cleanupAuthListener);
    browser.runtime.onMessage.addListener(this.cleanupDataListener);
  };

  unsubscribeListeners = () => {
    browser.runtime.onMessage.removeListener(this.cleanupAuthListener);
    browser.runtime.onMessage.removeListener(this.cleanupDataListener);
  };

  // *** Class Methods ***

  setGithubApiKey = async (apiKey) => {
    this.githubApiKey = apiKey;
    // Set chrome storage with apiKey and loggedin state
    await browser.storage.sync.set({
      apiKey: this.githubApiKey,
      isLoggedIn: true
    });
  };

  setAccountType = (accountType) => {
    this.accountType = accountType;
  };

  setBookmarks = (bookmarks) => {
    this.bookmarks = bookmarks;
  };

  // *** Auth API ***

  /*
   * Create new tab that redirects to https://<website>/signin
   * Extenion will start listening for "sign-in-complete" message
   * This page will
   *  1. auto click the "Sign in With Github" button
   *  2. login with github
   *  3. redirect to https://<website>/account
   * This callback page will
   *  1. Find the id of the Chummy chrome extension
   *  2. sendMessage to chrome extension
   * Extension receives message and removes listener
   * Continue with sign in.
   */
  signInWithGithub = async () => {
    try {
      // Create new tab
      const newTab = {
        url: new URL(APP_URLS.WEBSITE.SIGNIN, APP_URLS.WEBSITE.BASE).toString(),
        active: true
      };
      console.log('Creating new tab', newTab);
      await browser.tabs.create(newTab);

      // Call this method once browser receives sign-in-message
      const continueSignIn = async (request) => {
        const response = request?.payload;

        // Query store for user's account type, it will create one
        // if it doesn't exist
        if (!response || !response.user) {
          throw new Error('Sign in response is empty');
        }
        const { isNewUser } = response.additionalUserInfo;
        if (isNewUser) {
          // Create new firestore collection if user is new
          this.createNewUserCollection(response.user.uid);
        } else {
          // Get user data
          this.getUserCollection(response.user.uid);
        }

        // Set api key property
        this.setGithubApiKey(response.credential?.accessToken);

        return response;
      };

      // Listen for sign-in-complete message
      browser.runtime.onMessageExternal.addListener((request) => {
        if (request.action === 'sign-in-complete') {
          console.log('Received sign-in-complete request', request);
          return continueSignIn(request);
        }
      });
    } catch (error) {
      console.warn('Error signing in with Github', error);
    }
  };

  signOut = async () => {
    try {
      this.auth.signOut();
      this.setGithubApiKey(null);
      this.setAccountType(null);
      this.setBookmarks([]);
      // eslint-disable-next-line object-shorthand
      await browser.storage.sync.set({ apiKey: null, isLoggedIn: false });
      console.log('Api key removed from chrome storage');
    } catch (error) {
      console.warn('Error signing out', error);
    }
  };

  getCurrentUser = () => {
    if (!this.auth.currentUser) {
      console.warn('User is not authenticated.');
      return null;
    }
    const { uid, displayName, email, photoURL } = this.auth.currentUser;
    return {
      user: {
        uid,
        email,
        displayName,
        photoURL,
        apiKey: this.githubApiKey,
        accountType: this.accountType
      }
    };
  };

  // *** Firestore API ***
  createNewUserCollection = (userUuid) => {
    try {
      const newCollection = {
        accountType: AccountType.Community,
        bookmarks: []
      };
      console.log(
        '%c[WRITE] New user collection created',
        'background-color: green; color: white;'
      );
      this.dbUsers.doc(userUuid).set(newCollection, { merge: true });
      this.setAccountType(newCollection.accountType);
      this.setBookmarks(newCollection.bookmarks);
    } catch (error) {
      console.warn('Error creating new user collection', error);
    }
  };

  getUserCollection = async (userUuid) => {
    try {
      console.log(
        '%c[READ] User collection read',
        'background-color: blue; color: white;'
      );
      const userDoc = await this.dbUsers.doc(userUuid).get();
      if (userDoc.exists) {
        const user = userDoc.data();
        this.setAccountType(user.accountType);
        this.setBookmarks(user.bookmarks);
      }
    } catch (error) {
      console.warn('Error creating new user collection', error);
    }
  };

  createBookmark = async (bookmark) => {
    const currentUserUuid = this.getCurrentUser()?.user.uid;
    if (!currentUserUuid) {
      console.warn('Error adding bookmark because user is not logged in.');
      return;
    }
    /* From I.user.store.ts
    export interface Bookmark {
      uid: string;
      tab: Branch; // Contains repo, nodeName, and subpage info
    }
    */
    // Add bookmark in cloud db
    console.log(
      '%c[WRITE] New bookmark created',
      'background-color: green; color: white;'
    );
    // await this.dbUsers.doc(currentUserUuid).update({
    //   bookmarks: firebase.firestore.FieldValue.arrayUnion(bookmark)
    // });

    // Add to local cache of bookmarks
    this.setBookmarks([...this.bookmarks, bookmark]);
  };

  removeBookmark = async (bookmark) => {
    const currentUserUuid = this.getCurrentUser()?.user.uid;
    if (!currentUserUuid) {
      console.warn('Error removing bookmark because user is not logged in.');
      return;
    }
    // Remove from cloud db
    // await this.dbUsers.doc(currentUserUuid).update({
    //   bookmarks: firebase.firestore.FieldValue.arrayRemove(bookmark)
    // });
    console.log(
      '%c[WRITE] Bookmark deleted',
      'background-color: green; color: white;'
    );

    // Remove from local cache of bookmarks
    this.setBookmarks(
      this.bookmarks.filter((b) => b.bookmarkId !== bookmark.bookmarkId)
    );
  };

  updateBookmark = async (bookmark) => {
    const currentUserUuid = this.getCurrentUser()?.user.uid;
    if (!currentUserUuid) {
      console.warn('Error removing bookmark because user is not logged in.');
      return;
    }

    // Update in cloud db
    console.log(
      '%c[WRITE] Bookmark updated',
      'background-color: green; color: white;'
    );

    const userRef = this.dbUsers.doc(currentUserUuid);
    await this.db.runTransaction(async (t) => {
      const doc = await t.get(userRef);

      // Atomic transaction
      const newBookmarks = [
        ...doc
          .data()
          .bookmarks.filter(
            (bInDoc) => bInDoc.bookmarkId !== bookmark.bookmarkId
          ),
        bookmark
      ];
      t.update(userRef, { bookmarks: newBookmarks });
    });

    // Update local cache of bookmark
    this.setBookmarks([
      ...this.bookmarks.filter((b) => b.bookmarkId !== bookmark.bookmarkId),
      bookmark
    ]);
  };

  getAllBookmarks = async () => {
    const currentUserUuid = this.getCurrentUser()?.user.uid;
    if (!currentUserUuid) {
      console.warn('Cannot get bookmarks because user is not logged in.');
      return [];
    }

    // If locally cached in background
    if (this.bookmarks.length !== 0) {
      console.log(
        `Using cached bookmarks, retrieved ${this.bookmarks.length} bookmarks`
      );
      return { bookmarks: this.bookmarks };
    }

    // If not cached, make fetch request
    console.log(
      '%c[READ] Get all bookmarks',
      'background-color: blue; color: white;'
    );

    let bookmarks = [];
    const user = await this.dbUsers.doc(currentUserUuid).get();
    if (user.exists) {
      bookmarks = user.data().bookmarks;
    }

    // Update local cache of bookmark
    this.setBookmarks(bookmarks);

    return { bookmarks };
  };
}

// Initialize DAO store
const daoStore = new DAO();

// *** Window events ***

// Initialize listeners on extension open
const onBrowserActionClickedListener = async () => {
  try {
    if (await isExtensionOpen()) {
      return;
    }
    console.log('Initialize dao listeners');
    daoStore.subscribeListeners();
  } catch (error) {
    console.warn('Error initializing extension listeners', error);
  }
};
browser.browserAction.onClicked.addListener(() => {
  onBrowserActionClickedListener();
});

// Cleanup listeners on extension close
const onWindowRemoveListener = async (windowId) => {
  try {
    const { currentWindowId } = await browser.storage.sync.get([
      'currentWindowId'
    ]);
    if (isCurrentWindow(windowId, currentWindowId)) {
      daoStore.unsubscribeListeners();
    }
  } catch (error) {
    console.warn('Error cleaning up listeners', error);
  }
};
browser.windows.onRemoved.addListener((windowId) => {
  onWindowRemoveListener(windowId);
});
