import React, { useState } from 'react';
import { navigate } from '@reach/router';

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { useFirebase } from 'gatsby-plugin-firebase';
import View from './View';
import { setUser, isLoggedIn } from '../utils/auth';

const Login = () => {
  const [firebase, setFirebase] = useState();

  useFirebase((_firebase) => {
    setFirebase(_firebase);
  }, []);

  if (isLoggedIn()) {
    navigate(`/app/profile`);
  }

  function getUiConfig(auth) {
    return {
      signInFlow: 'popup',
      signInOptions: [
        auth.GoogleAuthProvider.PROVIDER_ID,
        auth.EmailAuthProvider.PROVIDER_ID
      ],
      // signInSuccessUrl: '/app/profile',
      callbacks: {
        signInSuccessWithAuthResult: (result) => {
          setUser(result.user);
          navigate('/app/profile');
        }
      }
    };
  }

  return (
    <View title="Log In">
      <p>Please sign-in to access to the private route:</p>
      {firebase && (
        <StyledFirebaseAuth
          uiConfig={getUiConfig(firebase.auth)}
          firebaseAuth={firebase.auth()}
        />
      )}
    </View>
  );
};

export default Login;
