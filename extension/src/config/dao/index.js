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
import UserError from '../../global/errors/user.error';

let isInitialized = false;

// Channel to talk to bg script
class DAO {
  constructor(store) {
    isInitialized = true;
    this.userStore = store.userStore; // mobx
    this.uiStore = store.uiStore;

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

    // If login doesn't happen in 2 min, set pending to false
    setTimeout(() => {
      this.userStore.setPending(false);
    }, 2 * 60 * 1000);

    try {
      // Sign in
      const request = {
        action: 'sign-in'
      };
      log.toBg('Sign in request -> bg', request);
      const response = await browser.runtime.sendMessage(request);

      // The extension receives a sign in triggered action
      if (response.error) {
        throw UserError.from(response.error);
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
      this.uiStore.addErrorPendingNotification(error);
      log.error('Error getting all bookmarks', error);
      return { status: 'error', error };
    } finally {
      this.userStore.setPending(false);
    }
    return { status: 'complete' };
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
      this.uiStore.addErrorPendingNotification(error);
      log.error('Error creating bookmark', error);
      return { status: 'error', error };
    } finally {
      this.userStore.setPending(false);
    }
    return { status: 'complete' };
  };

  updateBookmark = async (bookmark) => {
    this.userStore.setPending(true);
    try {
      await userUtils.updateBookmark(bookmark);
      // Only after request resolves, update local cache
      this.userStore.updateBookmark(bookmark);
    } catch (error) {
      this.uiStore.addErrorPendingNotification(error);
      log.error('Error updating bookmark', error);
      return { status: 'error', error };
    } finally {
      this.userStore.setPending(false);
    }
    return { status: 'complete' };
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
      this.uiStore.addErrorPendingNotification(error);
      log.error('Error remove bookmark', error);
      return { status: 'error', error };
    } finally {
      this.userStore.setPending(false);
    }
    return { status: 'complete' };
  };
}

// Provider
const DAOContext = createContext(null);
const DAOProvider = ({ children, store }) => {
  const [dao, setDAO] = useState();
  const octoDAO = useOctoDAO();

  useEffect(() => {
    if (!isInitialized) {
      setDAO(new DAO(store));
    }
  }, []);

  useEffect(() => {
    if (dao && octoDAO) {
      dao.setOctoDAO(octoDAO);
    }
  }, [octoDAO, dao]);

  return <DAOContext.Provider value={dao}>{children}</DAOContext.Provider>;
};
DAOProvider.propTypes = {
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  store: PropTypes.object.isRequired
};

export { DAOContext };
export default DAOProvider;
