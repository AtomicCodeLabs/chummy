import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';

import SplashSpinner from '../../components/Loading/SplashSpinner';
import useFirebaseDAO, { checkCurrentUser } from '../../hooks/firebase';
import { useUserStore } from '../../hooks/store';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

export default observer(() => {
  const firebase = useFirebaseDAO();
  const [isSplashScreen, setSplashScreen] = useState(true);
  const { error, isPending } = useUserStore();
  checkCurrentUser();

  // Set splash screen for 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashScreen(false);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const renderContents = () => {
    if (isSplashScreen || isPending) {
      return <SplashSpinner />;
    }
    // // If signing in
    // if (isPending) {
    //   return 'Pending';
    // }
    // If there was an error signing in
    if (error) {
      return 'Error';
    }

    return (
      <button
        onClick={() => {
          firebase.signIn();
        }}
        type="button"
      >
        Sign into Github
      </button>
    );
  };

  console.log('splash', isSplashScreen);
  console.log('pending', isPending);
  console.log('error', error);

  return <Container>{renderContents()}</Container>;
});
