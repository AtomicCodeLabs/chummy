/* eslint-disable no-unused-expressions */
import Amplify, { StorageHelper } from '@aws-amplify/core';
import API, { graphqlOperation } from '@aws-amplify/api';
import Auth from '@aws-amplify/auth';
import browser from 'webextension-polyfill';

import awsExports from '../aws-exports';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import * as compositeQueries from '../config/dao/queries';

import log from '../config/log';
import {
  isCurrentWindow,
  isExtensionOpen,
  storeTokens,
  resolveInjectJSFilenames,
  clone
} from './util';
import { isAllowed } from './throttling.util';
import { THROTTLING_OPERATION, APP_URLS } from '../global/constants';
import ThrottlingError from '../global/errors/throttling.error';
import UserError from '../global/errors/user.error';

const signInUrl = new URL(
  APP_URLS.WEBSITE.SIGNIN,
  APP_URLS.WEBSITE.BASE
).toString();
const redirectUrl = new URL(
  APP_URLS.WEBSITE.REDIRECT,
  APP_URLS.WEBSITE.BASE
).toString();
class DAO {
  constructor() {
    // Initialize DAO in background script
    try {
      Amplify.configure({
        ...awsExports,
        graphql_headers: async () => {
          const currentSession = await Auth.currentSession();
          return { Authorization: currentSession.getIdToken().getJwtToken() };
        }
      });
      this.api = API;
      this.auth = Auth;
      this.storage = new StorageHelper().getStorage();
      this.auth.configure({ storage: this.storage });
    } catch (error) {
      log.error('Error configuring DAO', error);
      return;
    }

    // Additional properties on this.auth.currentUser
    this.user = {
      uid: null,
      accountType: null,
      email: null,
      displayName: null,
      photoURL: null,
      bookmarks: [],
      apiKey: null
    };
    // this.githubApiKey = null; // Keep API key to make requests with on hand
    // this.accountType = null; // Keep accountType to know which request user is allowed to make
    // this.bookmarks = [];
    this.listeners = null;

    // If user hasn't signed out yet, apiKey will still be in
    // chrome storage. Use that for future requests.
    // browser.storage.sync.get(['apiKey']).then((items) => {
    //   if (items.apiKey) {
    //     this.setUser({ apiKey: items.apiKey });
    //   }
    // });

    // Subscribe only once
    if (!this.listeners) {
      this.subscribeListeners(); // Will get initialized on extension open
    }
  }

  // *** Listeners ***
  // Expose DAO Auth API that content script can query

  cleanupAuthListener = (request) => {
    if (
      [
        'sign-in',
        'sign-out',
        'get-current-user',
        'auth-from-content-script'
      ].includes(request.action)
    ) {
      return (async () => {
        // Sign In
        if (request.action === 'sign-in') {
          let success = false;
          let payload;
          let error;
          try {
            await this.signInWithGithub();
            payload = { triggered: true };
            success = true;
          } catch (e) {
            error = e;
          }
          return clone({
            action: request.action,
            ...(success ? { payload } : { error })
          });
        }
        // Sign Out
        if (request.action === 'sign-out') {
          this.signOut();
          return null;
        }
        // Post Sign In Complete
        if (request.action === 'auth-from-content-script') {
          let success = false;
          let payload;
          let error;
          try {
            await this.setUserAfterSignIn(request);
            payload = this.getCurrentUserPayload();
            success = true;
          } catch (e) {
            error = e;
          }
          // Send sign in complete message to extension
          const data = success ? { payload } : { error };
          this.sendMessageToExtension({
            ...data,
            action: 'sign-in-complete'
          });
          return clone({
            ...data,
            action: request.action
          });
        }
        // Get current user
        if (request.action === 'get-current-user') {
          return clone({
            action: request.action,
            payload: this.getCurrentUserPayload()
          });
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
            log.error(`Error handling ${request.action} action`, e);
            error = e;
          }
          return clone({
            action: request.action,
            ...(success ? { payload } : { error })
          });
        }
        // Update a bookmark
        if (request.action === 'update-bookmark') {
          let error;
          try {
            await this.updateBookmark(request.payload);
          } catch (e) {
            log.error(`Error handling ${request.action} action`, e);
            error = e;
          }
          return clone({
            action: request.action,
            ...(error && { error })
          });
        }
        // Create a bookmark
        if (request.action === 'create-bookmark') {
          let error;
          try {
            await this.createBookmark(request.payload);
          } catch (e) {
            log.error(`Error handling ${request.action} action`, e);
            error = e;
          }
          return clone({
            action: request.action,
            ...(error && { error })
          });
        }
        // Remove a bookmark
        if (request.action === 'remove-bookmark') {
          let error;
          try {
            await this.removeBookmark(request.payload);
          } catch (e) {
            log.error(`Error handling ${request.action} action`, e);
            error = e;
          }
          return clone({
            action: request.action,
            ...(error && { error })
          });
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

  setUser = async (user) => {
    // Only set the attributes that are available
    Object.keys(user).forEach((attr) => {
      if (
        [
          'uid',
          'email',
          'displayName',
          'photoURL',
          'apiKey',
          'accountType',
          'bookmarks'
        ].includes(attr)
      ) {
        // Transform bookmarks into compatible format before assigning them
        if (attr === 'bookmarks') {
          // If repo/branch are already javascript objects, they've already
          // been converted. If at least one is in string format, that means
          // createBookmark method was called, as only the recently fetched one
          // is stringified.
          user.bookmarks = user.bookmarks.map((b) => ({
            bookmarkId: b.id || b.bookmarkId,
            name: b.name,
            path: b.path,
            pinned: b.pinned,
            repo: typeof b.repo === 'string' ? JSON.parse(b.repo) : b.repo,
            branch:
              typeof b.branch === 'string' ? JSON.parse(b.branch) : b.branch
          }));
        }

        this.user[attr] = user[attr];

        // Persist some attributes to storage
        if (attr === 'apiKey') {
          browser.storage.sync.set({
            apiKey: user[attr]
          });
        }
      }
    });
  };

  getCurrentUserPayload = () => {
    if (!this.user) {
      throw new UserError('User is not logged in.');
    }
    return { user: this.user };
  };

  setBookmarks = (bookmarks) => {
    this.setUser({ bookmarks });
  };

  // *** Auth API ***

  /*
   * 1. Create new tab that redirects to https://<website>/signin
   * 2. That site will call Auth.signIn() on page load
   * 3. After the user logs in, they are redirected to https://<website>/account
   * 4. This whole time, background will have a tab listener for the tab it created that triggers a
   *  script inject when this redirect is made.
   * 5. This content script will send a 'post-sign-in' message to background with the user
   * 6. Bg script sets the user and sends a sign-in-complete to extension popup window.
   */
  signInWithGithub = async () => {
    try {
      // Create new tab
      const newTab = {
        url: signInUrl,
        active: true
      };
      const createdTab = await browser.tabs.create(newTab);

      // Create tab listener to inject content script on redirect
      browser.tabs.onUpdated.addListener(function injectListener(
        tabId,
        _changeInfo,
        tab
      ) {
        // make sure the status is 'complete' and it's the right tab
        if (
          tabId === createdTab.id &&
          tab.url.indexOf(redirectUrl) !== -1 &&
          tab.status === 'complete'
        ) {
          // Remove listener after one inject
          browser.tabs.onUpdated.removeListener(injectListener);

          // Inject script
          browser.tabs
            .executeScript(tabId, {
              file: resolveInjectJSFilenames('background.signin.inject')
            })
            .catch((e) => {
              log.error('Error injecting signin script', e);
            });
        }
      });
    } catch (error) {
      log.error('Error signing in with Github', error);
      throw UserError.from(error);
    }
  };

  setUserAfterSignIn = async (request) => {
    try {
      // Call this method once browser receives sign-in-message
      const response = request?.payload?.user;

      // Query store for user's account type, it will create one
      // if it doesn't exist
      if (!response) {
        throw new UserError('Sign in response is empty');
      }

      storeTokens(
        this.storage,
        response,
        awsExports.aws_user_pools_web_client_id
      );

      // Get user's collection or create if it doesn't exist
      const user = await this.getUserCollection(response.sub);

      // Now that a user doc has been fetched/created, set the user's properties in memory
      this.setUser({
        uid: response.sub,
        email: response.email,
        displayName: response.name,
        photoURL: response.picture,
        apiKey: response['custom:access_token'],
        accountType: user.accountType,
        bookmarks: user.bookmarks.items
      });
    } catch (error) {
      log.error('Error setting user after sign in', error);
      throw UserError.from(error);
    }
  };

  signOut = async () => {
    try {
      this.auth.signOut();
      this.setUser({
        apiKey: null
      });
      this.setBookmarks([]);
    } catch (error) {
      log.error('Error signing out', error);
    }
  };

  sendMessageToExtension = (message) => {
    browser.runtime.sendMessage(message);
  };

  // *** Data API ***
  getUserCollection = async (userUuid) => {
    let userDoc;
    // let isNewSignup = true;
    let error;

    try {
      // Try fetching
      log.apiRead('[READ] User collection + all user bookmarks read');

      userDoc = (
        await this.api.graphql(
          graphqlOperation(queries.getUser, { id: userUuid })
        )
      )?.data?.getUser;
      // if (userDoc) {
      //   isNewSignup = false;
      // }
    } catch (e) {
      error = e;
    }

    // // If user doesn't exist, try creating one.
    // if (isNewSignup) {
    //   try {
    //     // User doesn't exist, so create one
    //     log.apiWrite('[WRITE] User collection created');

    //     const newUser = {
    //       id: userUuid,
    //       accountType: ACCOUNT_TYPE.Community
    //     };
    //     userDoc = (
    //       await this.api.graphql(
    //         graphqlOperation(mutations.createUser, { input: newUser })
    //       )
    //     )?.data?.createUser;
    //   } catch (e) {
    //     error = e;
    //   }
    // }

    if (!userDoc || error) {
      throw UserError.from(error);
    }

    return userDoc;
  };

  createBookmark = async (bookmark) => {
    // Make sure user is logged in
    const currentUserUuid = this.getCurrentUserPayload()?.user?.uid;

    // Add bookmark in cloud db
    const newBookmark = {
      id: bookmark.bookmarkId,
      userId: currentUserUuid,
      name: bookmark.name,
      path: bookmark.path,
      pinned: bookmark.pinned,
      branch: JSON.stringify(bookmark.branch),
      repo: JSON.stringify(bookmark.repo)
    };

    // Check if user is allowed to make this request
    if (
      !isAllowed(
        this.getCurrentUserPayload()?.user,
        THROTTLING_OPERATION.CreateBookmark
      )
    ) {
      throw new ThrottlingError(
        'Cannot create bookmark because the maximum number of bookmarks for your tier has been reached.'
      );
    }
    // Make create request
    await this.api.graphql(
      graphqlOperation(mutations.createBookmark, { input: newBookmark })
    );
    log.apiWrite('[WRITE] New bookmark created');

    // Add to local cache of bookmarks
    this.setBookmarks([...this.user.bookmarks, bookmark]);
  };

  removeBookmark = async (bookmark) => {
    // Make sure user is logged in
    this.getCurrentUserPayload()?.user?.uid;

    // Make delete request
    await this.api.graphql(
      graphqlOperation(mutations.deleteBookmark, {
        input: { id: bookmark.bookmarkId }
      })
    );
    log.apiWrite('[WRITE] Bookmark deleted');

    // Remove from local cache of bookmarks
    this.setBookmarks(
      this.user.bookmarks.filter((b) => b.bookmarkId !== bookmark.bookmarkId)
    );
  };

  updateBookmark = async (bookmark) => {
    if (!bookmark.bookmarkId) {
      log.error('Error updating bookmark because bookmark id is not specified');
      return;
    }
    // Make sure user is logged in
    const currentUserUuid = this.getCurrentUserPayload()?.user?.uid;

    // Update in cloud db
    log.apiWrite('[WRITE] Bookmark updated');

    const newBookmark = {
      id: bookmark.bookmarkId,
      ...(currentUserUuid && { userId: currentUserUuid }),
      ...(bookmark.name && { name: bookmark.name }),
      ...(bookmark.path && { path: bookmark.path }),
      ...(bookmark.pinned && { pinned: bookmark.pinned }),
      ...(bookmark.branch && { branch: JSON.stringify(bookmark.branch) }),
      ...(bookmark.repo && { repo: JSON.stringify(bookmark.repo) })
    };

    // Make create request
    await this.api.graphql(
      graphqlOperation(mutations.updateBookmark, { input: newBookmark })
    );

    // Update local cache of bookmark
    this.setBookmarks([
      ...this.user.bookmarks.filter(
        (b) => b.bookmarkId !== bookmark.bookmarkId
      ),
      bookmark
    ]);
  };

  getAllBookmarks = async () => {
    // Make sure user is logged in
    const currentUserUuid = this.getCurrentUserPayload()?.user?.uid;

    // If locally cached in background
    if (this.user.bookmarks?.length !== 0) {
      log.log(
        `Using cached bookmarks, retrieved ${this.user.bookmarks.length} bookmarks`
      );
      return { bookmarks: this.user.bookmarks };
    }

    // Fallback option is to make request for just bookmarks
    log.apiRead('[READ] Get all bookmarks');

    const bookmarks =
      (
        await this.api.graphql(
          graphqlOperation(compositeQueries.getUserBookmarks, {
            userId: currentUserUuid
          })
        )
      )?.data?.getUser?.bookmarks?.items || [];

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
      log.error(
        'Error initializing DAO listeners because extension is already open'
      );
      return;
    }
    log.log('Initialize DAO listeners');
    daoStore.subscribeListeners();
  } catch (error) {
    log.error('Error initializing extension listeners', error);
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
    log.error('Error cleaning up listeners', error);
  }
};
browser.windows.onRemoved.addListener((windowId) => {
  onWindowRemoveListener(windowId);
});
