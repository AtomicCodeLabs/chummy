/* global chrome */
import firebase from 'firebase/app';
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
    this.githubCredential = null; // Keep API key to make requests with on hand

    // On auth change, send message to content script tab.
    this.authStateListener = this.auth.onAuthStateChanged((user) => {
      inActiveTab((tabs) => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: 'auth-state-changed', user },
          () => {
            console.log('auth-state-changed message sent');
          }
        );
      });
    });
  }

  // *** Class Methods ***

  setGithubCredential = (apiKey) => {
    this.githubCredential = apiKey;
  };

  // *** Auth API ***

  signInWithGithub = async () => {
    const response = await this.auth.signInWithPopup(this.githubProvider);
    this.setGithubCredential(response.credential);
    chrome.storage.sync.set(
      { apiKey: response.credential, isLoggedIn: true },
      () => {
        console.log('Api key stored in chrome storage: ', response.credential);
      }
    );
    return response;
  };

  signOut = () => {
    this.auth.signOut();
    this.setGithubCredential(null);
    // eslint-disable-next-line object-shorthand
    chrome.storage.sync.set({ apiKey: null, isLoggedIn: false }, () => {
      console.log('Api key removed from chrome storage');
    });
  };

  getCurrentUser = () => ({
    credential: this.githubCredential,
    user: this.auth.currentUser
  });
}

const firebaseStore = new Firebase();

// Expose firebase API that content script can query
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(
    sender.tab
      ? `from a content script:${sender.tab.url}`
      : 'from the extension',
    request
  );

  // Sign In
  if (request.action === 'sign-in') {
    console.log('sign-in action triggered');
    (async () => {
      let success = false;
      let payload;
      let error;
      try {
        payload = await firebaseStore.signInWithGithub();
        console.log('payload', payload);
        success = true;
      } catch (e) {
        error = e;
      } finally {
        sendResponse({
          action: 'sign-in',
          ...(success ? { payload } : { error })
        });
      }
    })();
  }

  // Sign Out
  else if (request.action === 'sign-out') {
    console.log('sign-out action triggered');
    firebaseStore.signOut();
    sendResponse();
  }
  // Get current user
  else if (request.action === 'get-current-user') {
    console.log('get-current-user action triggered');
    sendResponse({
      action: 'get-current-user',
      payload: firebaseStore.getCurrentUser()
    });
  }

  return true; // necessary to indicate content script to wait for async
});
