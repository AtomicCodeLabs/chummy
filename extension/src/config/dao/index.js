/* eslint-disable import/no-named-as-default-member */
import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import browser from 'webextension-polyfill';

import log from '../log';
import useOctoDAO from '../../hooks/octokit';
import { isBlank } from '../../utils';
import userUtils from '../../utils/user';
import {
  transformBookmarks,
  bookmarkRepoMapToArray
} from '../../utils/bookmark';

let isInitialized = false;

// Channel to talk to bg script
class FirebaseDAO {
  constructor(store) {
    isInitialized = true;
    this.userStore = store.userStore; // mobx

    // Add listener for auth changes and store
    browser.runtime.onMessage.addListener((response) => {
      if (response.action === 'auth-state-changed') {
        this.handleUserResponse(response);
      }
    });
  }

  setOctoDAO = (octoDAO) => {
    this.octoDAO = octoDAO;
  };

  // *** Auth API ***

  signIn = async () => {
    this.userStore.setPending(true);

    try {
      // Sign in
      const request = {
        action: 'sign-in'
      };
      log.toBg('Sign in request -> bg', request);
      const response = await browser.runtime.sendMessage(request);

      // The extension receives a sign in triggered action
      if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      log.error('Error signing in', error);
      this.userStore.setError(error);
    } finally {
      // this.userStore.setPending(false);
    }
  };

  signInComplete = (req) => {
    // this.userStore.setPending(true);

    // Check for error and handle
    if (req.error) {
      this.userStore.setError(req.error);
      this.userStore.setPending(false);
      return;
    }

    if (!req?.payload?.user || isBlank(req.payload.user)) {
      this.userStore.setError('Error: User missing in payload.');
      this.userStore.setPending(false);
      return;
    }

    // Set user store
    this.userStore.setUser({
      user: req.payload.user
    });
    this.octoDAO.authenticate(req?.payload?.user?.apiKey);

    // Fetch user's bookmarks
    this.getAllBookmarks();

    this.userStore.setPending(false);
  };

  signOut = () => {
    const request = { action: 'sign-out' };
    log.toBg('Sign out request -> bg', request);
    browser.runtime.sendMessage(request);
    this.userStore.clearUser(); // cleans up user and user's bookmarks
    this.octoDAO.unauthenticate();
  };

  getCurrentUser = async () => {
    this.userStore.setPending(true);

    try {
      const request = {
        action: 'get-current-user'
      };
      log.toBg('Get current user -> bg', request);
      const response = await browser.runtime.sendMessage(request);
      log.debug('Response', response);
      this.handleUserResponse(response);
    } catch (error) {
      log.error('Error getting current user', error);
    } finally {
      this.userStore.setPending(false);
    }
  };

  // Util method to handle user payload from bg script
  handleUserResponse = (response) => {
    if (response?.payload) {
      if (!isBlank(response.payload.user)) {
        // If user is signed in
        this.userStore.setUser({
          user: response.payload.user
        });
        this.octoDAO.authenticate(response.payload.user?.apiKey);
      } else {
        // If user signs out, payload.user will be empty
        this.userStore.clearUser();
        this.octoDAO.unauthenticate();
      }
    }
  };

  // *** Firestore API ***

  getAllBookmarks = async () => {
    if (!this.userStore.isLoggedIn) {
      log.warn('Firebase is not authenticated.');
      return null;
    }
    // Check if cached bookmarks exist in store first
    if (this.userStore.hasBookmarksCached) {
      return this.userStore.getUserBookmarks();
    }

    this.userStore.setPending(true);
    try {
      const response = await userUtils.getAllBookmarks();
      if (response?.payload?.bookmarks) {
        // Bookmarks will be array, so they'll need transforming
        this.userStore.setUserBookmarks(
          bookmarkRepoMapToArray(transformBookmarks(response.payload.bookmarks))
        );
      }
    } catch (error) {
      log.error('Error getting all bookmarks', error);
    } finally {
      this.userStore.setPending(false);
    }
  };

  addBookmark = async (bookmark) => {
    this.userStore.setPending(true);
    try {
      await userUtils.addBookmark(bookmark);

      // Repo.bookmarks with default settings
      const bookmarkRepo = {
        owner: bookmark.repo.owner,
        name: bookmark.repo.name,
        bookmarks: {
          [bookmark.bookmarkId]: bookmark
        }
      };
      // Only after request resolves, update local cache
      this.userStore.addBookmark(bookmarkRepo);
    } catch (error) {
      log.error('Error creating bookmark', error);
    } finally {
      this.userStore.setPending(false);
    }
  };

  updateBookmark = async (bookmark) => {
    this.userStore.setPending(true);
    try {
      await userUtils.updateBookmark(bookmark);
      // Only after request resolves, update local cache
      this.userStore.updateBookmark(bookmark);
    } catch (error) {
      log.error('Error updating bookmark', error);
    } finally {
      this.userStore.setPending(false);
    }
  };

  removeBookmark = async (bookmark) => {
    this.userStore.setPending(true);
    try {
      await userUtils.removeBookmark(bookmark);

      // Repo.bookmarks with default settings
      const bookmarkRepo = {
        owner: bookmark.repo.owner,
        name: bookmark.repo.name,
        bookmarks: {
          [bookmark.bookmarkId]: bookmark
        }
      };
      this.userStore.removeBookmark(bookmarkRepo);
    } catch (error) {
      log.error('Error remove bookmark', error);
    } finally {
      this.userStore.setPending(false);
    }
  };
}

// Provider
const FirebaseContext = createContext(null);
const FirebaseProvider = ({ children, store }) => {
  const [firebaseDAO, setFirebaseDAO] = useState();
  const octoDAO = useOctoDAO();

  useEffect(() => {
    if (!isInitialized) {
      setFirebaseDAO(new FirebaseDAO(store));
    }
  }, []);

  useEffect(() => {
    if (firebaseDAO && octoDAO) {
      firebaseDAO.setOctoDAO(octoDAO);
    }
  }, [octoDAO, firebaseDAO]);

  return (
    <FirebaseContext.Provider value={firebaseDAO}>
      {children}
    </FirebaseContext.Provider>
  );
};
FirebaseProvider.propTypes = {
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  store: PropTypes.object.isRequired
};

export { FirebaseContext };
export default FirebaseProvider;
