import firebase from 'firebase/app';
import browser from 'webextension-polyfill';
import 'firebase/auth';
import 'firebase/firestore';
import 'regenerator-runtime/runtime'; // for async/await to work
import 'core-js/stable'; // or a more selective import such as "core-js/es/array"

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

    // On auth change, send message to popup extension
    // Triggered on sign in, sign out, and token refresh events
    // To keep user store in sync with auth events
    const onUserChangeListener = async () => {
      try {
        const currentUser = this.getCurrentUser();
        const payload = { user: currentUser };
        // Send message to extension window
        await browser.runtime.sendMessage({
          action: 'auth-state-changed',
          payload
        });
      } catch (error) {
        console.error('Error sending auth state change message', error);
      }
    };
    this.authStateListener = this.auth.onIdTokenChanged((user) => {
      return onUserChangeListener(user);
    });

    // If user hasn't signed out yet, apiKey will still be in
    // chrome storage. Use that for future requests.
    browser.storage.sync.get(['apiKey']).then((items) => {
      if (items.apiKey) {
        this.setGithubApiKey(items.apiKey);
      }
    });
  }

  // *** Class Methods ***

  setGithubApiKey = (apiKey) => {
    this.githubApiKey = apiKey;
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
        // Get bookmarks
      }

      // Set api key property
      this.setGithubApiKey(response.credential?.accessToken);

      // Set chrome storage with apiKey and loggedin state
      await browser.storage.sync.set({
        apiKey: response.credential?.accessToken,
        isLoggedIn: true
      });
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
      // eslint-disable-next-line object-shorthand
      await browser.storage.sync.set({ apiKey: null, isLoggedIn: false });
      console.log('Api key removed from chrome storage');
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  getCurrentUser = () => {
    if (!this.auth.currentUser) {
      console.log('User is not authenticated.');
      return null;
    }
    const { uid, displayName, photoURL } = this.auth.currentUser;
    return {
      user: {
        uid,
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
        accountType: 'basic'
      };
      this.dbUsers.doc(userUuid).set(newCollection, { merge: true });
      this.setAccountType(newCollection.accountType);
      this.setBookmarks([]);
    } catch (error) {
      console.error('Error creating new user collection', error);
    }
  };

  createBookmark = async (bookmark) => {
    console.log('create bookmark', this.getCurrentUser(), bookmark);
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
    await this.dbUsers
      .doc(currentUserUuid)
      .collection('bookmarks')
      .doc(bookmark.bookmarkId)
      .set(bookmark);

    // Add to local cache of bookmarks
    this.setBookmarks([...this.bookmarks, bookmark]);
  };

  removeBookmark = async (bookmark) => {
    const currentUserUuid = this.getCurrentUser()?.user.uid;
    if (!currentUserUuid) {
      console.log('Cannot remove bookmark because user is not logged in.');
      return;
    }
    // Remove from cloud db
    await this.dbUsers
      .doc(currentUserUuid)
      .collection('bookmarks')
      .doc(bookmark.bookmarkId)
      .delete();

    // Remove from local cache of bookmarks
    this.setBookmarks(this.bookmarks.filter((b) => b.uid !== bookmark.uid));
  };

  updateBookmark = async (bookmark) => {
    const currentUserUuid = this.getCurrentUser()?.user.uid;
    if (!currentUserUuid) {
      console.log('Cannot remove bookmark because user is not logged in.');
      return;
    }

    // Update in cloud db
    await this.dbUsers
      .doc(currentUserUuid)
      .collection('bookmarks')
      .doc(bookmark.bookmarkId)
      .set(bookmark, { merge: true });

    // Update local cache of bookmark
    this.setBookmarks([
      ...this.bookmarks.filter((b) => b.uid !== bookmark.uid),
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
    if (this.bookmarks) {
      console.log('USING CACHED BOOKMARKS', this.bookmarks);
      return { bookmarks: this.bookmarks };
    }

    // If not cached, make fetch request
    console.log('Making bookmarks request');
    const bookmarks = await this.dbUsers
      .doc(currentUserUuid)
      .collection('bookmarks')
      .get()
      .docs.map((b) => b.data());
    return { bookmarks };
  };
}

const firebaseStore = new Firebase();

// Expose firebase Auth API that content script can query
const firebaseAccessListener = async (request) => {
  // Sign In
  if (request.action === 'sign-in') {
    let success = false;
    let payload;
    let error;
    try {
      await firebaseStore.signInWithGithub();
      payload = firebaseStore.getCurrentUser();
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
    firebaseStore.signOut();
    return null;
  }
  // Get current user
  if (request.action === 'get-current-user') {
    return {
      action: request.action,
      payload: firebaseStore.getCurrentUser()
    };
  }
  return null;
};
browser.runtime.onMessage.addListener((request) => {
  if (['sign-in', 'sign-out', 'get-current-user'].includes(request.action)) {
    return firebaseAccessListener(request);
  }
});

// Expose firestore API that content script can query
const firebaseDataListener = async (request) => {
  console.log(request.action, 'action triggered');
  // Get current user's bookmarks
  if (request.action === 'get-bookmarks') {
    let success = false;
    let payload;
    let error;
    try {
      payload = await firebaseStore.getAllBookmarks();
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
      await firebaseStore.updateBookmark(request.payload);
    } catch (e) {
      console.error(`Error handling ${request.action} action`, e);
    }
    return null;
  }
  // Create a bookmark
  if (request.action === 'create-bookmark') {
    try {
      await firebaseStore.createBookmark(request.payload);
    } catch (e) {
      console.error(`Error handling ${request.action} action`, e);
    }
    return null;
  }
  // Remove a bookmark
  if (request.action === 'remove-bookmark') {
    try {
      await firebaseStore.removeBookmark(request.payload);
    } catch (e) {
      console.error(`Error handling ${request.action} action`, e);
    }
    return null;
  }
  return null;
};
browser.runtime.onMessage.addListener((request) => {
  if (
    [
      'get-bookmarks',
      'update-bookmark',
      'create-bookmark',
      'remove-bookmark'
    ].includes(request.action)
  ) {
    return firebaseDataListener(request);
  }
});
