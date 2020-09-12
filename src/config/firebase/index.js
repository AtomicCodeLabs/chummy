/* global chrome */
import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

let isInitialized = false;

// Channel to talk to bg script
class FirebaseDAO {
  constructor(store) {
    isInitialized = true;
    this.userStore = store.userStore; // mobx

    // Add listener for auth changes and store
    chrome.runtime.onMessage.addListener((request) => {
      console.log('request received', request);
      console.assert(request.action === 'auth-state-changed');
      if (request.action === 'auth-state-changed') {
        console.log('auth-state-changed message received', request);
        this.userStore.setUser({ user: request.user });
      }
    });
  }

  // *** Auth API ***

  signIn = () => {
    console.log('sign-in message sent');
    this.userStore.setPending(true);
    chrome.runtime.sendMessage({ action: 'sign-in' }, (response) => {
      if (response) {
        console.log('sign-in message received', response);
        this.userStore.setUser({
          user: response.payload.user,
          credential: response.payload.credential
        });
        this.userStore.setPending(false);
      }
    });
  };

  signOut = () => {
    chrome.runtime.sendMessage({ action: 'sign-out' }, () => {
      console.log('sign-out message received');
      this.userStore.setUser();
    });
  };

  getCurrentUser = () => {
    console.log('get-current-user message sent');
    this.userStore.setPending(true);
    chrome.runtime.sendMessage({ action: 'get-current-user' }, (response) => {
      console.log('get-current-user message received');
      this.userStore.setUser({
        user: response.payload.user,
        credential: response.payload.credential
      });

      this.userStore.setPending(false);
    });
    return this.userStore.user;
  };
}

// Provider
const FirebaseContext = createContext(null);
const FirebaseProvider = ({ children, store }) => {
  const [firebaseDAO, setFirebaseDAO] = useState();
  useEffect(() => {
    if (!isInitialized) {
      console.log(store);
      setFirebaseDAO(new FirebaseDAO(store));
    }
  }, []);

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
