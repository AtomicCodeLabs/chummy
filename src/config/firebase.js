import React, { createContext } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import 'firebase/auth';

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
  constructor(store) {
    firebase.initializeApp(config);

    this.auth = firebase.auth();
    this.store = store.userStore;
    this.githubProvider = new firebase.auth.GithubAuthProvider();
    this.authStateListener = this.auth.onAuthStateChanged((user) => {
      this.store.setUser({ user });
    });
  }

  // *** Auth API ***

  signInWithGithub = () => {
    this.store.setPending(true);
    this.auth
      .signInWithPopup(this.githubProvider)
      .then(({ credential, user }) => {
        this.store.setUser({ user, credential });
        this.store.setPending(false);
      });
  };

  signOut = () => this.auth.signOut();
}

// Provider
const FirebaseContext = createContext(null);
const FirebaseProvider = ({ children, store }) => {
  return (
    <FirebaseContext.Provider
      value={!firebase.apps.length ? new Firebase(store) : firebase.app()}
    >
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
