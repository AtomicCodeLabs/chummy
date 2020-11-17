import firebase from 'firebase/app';
import browser from 'webextension-polyfill';
import 'firebase/auth';
import 'firebase/firestore';
import 'regenerator-runtime/runtime'; // for async/await to work
import 'core-js/stable'; // or a more selective import such as "core-js/es/array"
import { isCurrentWindow, isExtensionOpen } from './util';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

class Firebase {
  constructor() {
    // Initialize firebase in background script
    firebase.initializeApp(config);

    this.auth = firebase.auth();
    this.db = firebase.firestore();
    this.dbUsers = this.db.collection('users');
    this.githubProvider = new firebase.auth.GithubAuthProvider();
    this.githubProvider.addScope('repo'); // add for private repo access
    this.githubProvider.addScope('user'); // add for user information

    // Additional properties on this.auth.currentUser
    this.githubApiKey = null; // Keep API key to make requests with on hand
    this.accountType = null; // Keep accountType to know which request user is allowed to make
    this.bookmarks = [];
    this.firebaseListeners = null;

    // If user hasn't signed out yet, apiKey will still be in
    // chrome storage. Use that for future requests.
    browser.storage.sync.get(['apiKey']).then((items) => {
      if (items.apiKey) {
        this.setGithubApiKey(items.apiKey);
      }
    });

    // Subscribe only once
    if (!this.firebaseListeners) {
      this.subscribeListeners(); // Will get initialized on extension open
    }
  }

  // *** Listeners ***
  // Expose firebase Auth API that content script can query

  cleanupFirebaseAccessListener = (request) => {
    if (['sign-in', 'sign-out', 'get-current-user'].includes(request.action)) {
      return (async () => {
        // Sign In
        if (request.action === 'sign-in') {
          console.log('RECEIVING SINGING');
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
  cleanupFirebaseDataListener = (request) => {
    if (
      [
        'get-bookmarks',
        'update-bookmark',
        'create-bookmark',
        'remove-bookmark'
      ].includes(request.action)
    ) {
      return (async () => {
        console.log(request.action, 'action triggered');
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
            console.error(`Error handling ${request.action} action`, e);
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
            console.error(`Error handling ${request.action} action`, e);
          }
          return null;
        }
        // Create a bookmark
        if (request.action === 'create-bookmark') {
          try {
            await this.createBookmark(request.payload);
          } catch (e) {
            console.error(`Error handling ${request.action} action`, e);
          }
          return null;
        }
        // Remove a bookmark
        if (request.action === 'remove-bookmark') {
          try {
            await this.removeBookmark(request.payload);
          } catch (e) {
            console.error(`Error handling ${request.action} action`, e);
          }
          return null;
        }
        return null;
      })(request);
    }
  };

  subscribeListeners = () => {
    // On auth change, send message to popup extension
    // Triggered on sign in, sign out, and token refresh events
    // To keep user store in sync with auth events
    // const onUserChangeListener = async () => {
    //   try {
    //     const currentUser = this.getCurrentUser();
    //     const payload = { user: currentUser };
    //     console.log(
    //       '%c[READ] Auth token changed listener',
    //       'background-color: blue; color: white;'
    //     );
    //     // Send message to extension window
    //     await browser.runtime.sendMessage({
    //       action: 'auth-state-changed',
    //       payload
    //     });
    //   } catch (error) {
    //     console.error('Error sending auth state change message', error);
    //   }
    // };
    // this.authStateListener = this.auth.onIdTokenChanged((user) => {
    //   return onUserChangeListener(user);
    // });
    browser.runtime.onMessage.addListener(this.cleanupFirebaseAccessListener);
    browser.runtime.onMessage.addListener(this.cleanupFirebaseDataListener);
  };

  unsubscribeListeners = () => {
    // if (this.authStateListener) {
    //   console.log("unsubscribe from auth state")
    //   this.authStateListener();
    // }
    browser.runtime.onMessage.removeListener(
      this.cleanupFirebaseAccessListener
    );
    browser.runtime.onMessage.removeListener(this.cleanupFirebaseDataListener);
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

  signInWithGithub = async () => {
    let response = null;
    try {
      // Sign in
      response = await this.auth.signInWithPopup(this.githubProvider);

      // Query firestore for user's account type, it will create one
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
      console.log('API KEY', this.githubApiKey);
    } catch (error) {
      console.error('Error signing in with Github', error);
    }
    return response;
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
      console.error('Error signing out', error);
    }
  };

  getCurrentUser = () => {
    if (!this.auth.currentUser) {
      console.error('User is not authenticated.');
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
        accountType: 'basic',
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
      console.error('Error creating new user collection', error);
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
        console.log(user);
        this.setAccountType(user.accountType);
        this.setBookmarks(user.bookmarks);
      }
    } catch (error) {
      console.error('Error creating new user collection', error);
    }
  };

  createBookmark = async (bookmark) => {
    const currentUserUuid = this.getCurrentUser()?.user.uid;
    if (!currentUserUuid) {
      console.log('Cannot add bookmark because user is not logged in.');
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
    await this.dbUsers.doc(currentUserUuid).update({
      bookmarks: firebase.firestore.FieldValue.arrayUnion(bookmark)
    });

    // Add to local cache of bookmarks
    this.setBookmarks([...this.bookmarks, bookmark]);
  };

  removeBookmark = async (bookmark) => {
    const currentUserUuid = this.getCurrentUser()?.user.uid;
    if (!currentUserUuid) {
      console.log('Cannot remove bookmark because user is not logged in.');
      return;
    }
    console.log('try to remove bookmark', bookmark);
    // Remove from cloud db
    await this.dbUsers.doc(currentUserUuid).update({
      bookmarks: firebase.firestore.FieldValue.arrayRemove(bookmark)
    });
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
      console.log('Cannot remove bookmark because user is not logged in.');
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
      console.log('Cannot get bookmarks because user is not logged in.');
      return [];
    }

    // If locally cached in background
    if (this.bookmarks.length !== 0) {
      console.log('USING CACHED BOOKMARKS', this.bookmarks);
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

// Initialize firebase store
const firebaseStore = new Firebase();

// *** Window events ***

// Initialize listeners on extension open
const onBrowserActionClickedListener = async () => {
  try {
    if (await isExtensionOpen()) {
      return;
    }
    console.log('initialize firebase listeners');
    firebaseStore.subscribeListeners();
  } catch (error) {
    console.error('Error initializing extension listeners', error);
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
      firebaseStore.unsubscribeListeners();
    }
  } catch (error) {
    console.error('Error cleaning up listeners', error);
  }
};
browser.windows.onRemoved.addListener((windowId) => {
  onWindowRemoveListener(windowId);
});