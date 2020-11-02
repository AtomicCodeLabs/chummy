import firebase from 'firebase/app';
import browser from 'webextension-polyfill';
import 'firebase/auth';
import 'regenerator-runtime/runtime'; // for async/await to work
import 'core-js/stable'; // or a more selective import such as "core-js/es/array"
import { inActiveTab } from './util';

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
    this.githubProvider = new firebase.auth.GithubAuthProvider();
    this.githubProvider.addScope('repo'); // add for private repo access
    this.githubProvider.addScope('user'); // add for user information
    this.githubApiKey = null; // Keep API key to make requests with on hand

    // On auth change, send message to content script tab.
    this.authStateListener = this.auth.onAuthStateChanged((user) => {
      inActiveTab(async (tabs) => {
        if (tabs.length) {
          try {
            await browser.tabs.sendMessage(tabs[0].id, {
              action: 'auth-state-changed',
              payload: user
            });
          } catch (error) {
            console.error('Error sending auth state change message', error);
          }
        }
      });
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

  // *** Auth API ***

  signInWithGithub = async () => {
    let response = null;
    try {
      response = await this.auth.signInWithPopup(this.githubProvider);
      this.setGithubApiKey(response.credential?.accessToken);
      await browser.storage.sync.set({
        apiKey: response.credential?.accessToken,
        isLoggedIn: true
      });
      console.log(
        'Api key stored in chrome storage: ',
        response.credential?.accessToken
      );
    } catch (error) {
      console.error('Error signing in with Github', error);
    }
    return response;
  };

  signOut = async () => {
    try {
      this.auth.signOut();
      this.setGithubApiKey(null);
      // eslint-disable-next-line object-shorthand
      await browser.storage.sync.set({ apiKey: null, isLoggedIn: false });
      console.log('Api key removed from chrome storage');
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  getCurrentUser = () => {
    console.log('currentuser', this.auth.currentUser);
    const { uid, displayName, photoURL } = this.auth.currentUser;
    return {
      user: {
        uid,
        displayName,
        photoURL,
        apiKey: this.githubApiKey
      }
    };
  };
}

const firebaseStore = new Firebase();

// Expose firebase API that content script can query
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
      action: 'sign-in',
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
    console.log('get-current-user action triggered');
    return {
      action: 'get-current-user',
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
