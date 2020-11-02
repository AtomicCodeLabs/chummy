import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import browser from 'webextension-polyfill';

import useOctoDAO from '../../hooks/octokit';

let isInitialized = false;

// Channel to talk to bg script
class FirebaseDAO {
  constructor(store) {
    isInitialized = true;
    this.userStore = store.userStore; // mobx

    // Add listener for auth changes and store
    browser.runtime.onMessage.addListener((response) => {
      if (response.action === 'auth-state-changed') {
        // Set user
        this.userStore.setUser({
          user: response.payload.user
        });
      }
    });
  }

  setOctoDAO = (octoDAO) => {
    this.octoDAO = octoDAO;
  };

  // *** Auth API ***

  signIn = async () => {
    // console.log('sign-in message sent');
    this.userStore.setPending(true);
    const response = await browser.runtime
      .sendMessage({ action: 'sign-in' })
      .catch((e) => console.error('Error signing in', e));
    console.log('RESPONSE', response);
    if (response) {
      console.log('sign-in message received', response);
      this.userStore.setUser({
        user: response.payload.user
      });
      this.userStore.setPending(false);
      this.octoDAO.authenticate(response.payload.user?.apiKey);
    }
    this.userStore.setPending(false);
  };

  signOut = () => {
    browser.runtime.sendMessage({ action: 'sign-out' });
    this.userStore.setUser({});
    this.octoDAO.unauthenticate();
  };

  getCurrentUser = async () => {
    // console.log('get-current-user message sent');
    this.userStore.setPending(true);

    const response = await browser.runtime
      .sendMessage({
        action: 'get-current-user'
      })
      .catch((e) => console.error('Error getting current user', e));
    if (response) {
      this.userStore.setUser({
        user: response.payload.user
      });
      this.octoDAO.authenticate(response.payload.user?.apiKey);
      this.userStore.setPending(false);
    } else {
      console.error('Error getting current user', response?.error);
    }

    this.userStore.setPending(false);
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
  children: PropTypes.element.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  store: PropTypes.object.isRequired
};

export { FirebaseContext };
export default FirebaseProvider;
