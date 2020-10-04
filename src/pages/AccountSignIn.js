import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import useFirebaseDAO, { checkCurrentUser } from '../hooks/firebase';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const SplashIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 5px;
  border: 2px dotted lightgray;
`;

export default observer(() => {
  const firebase = useFirebaseDAO();
  const [isSplashScreen, setSplashScreen] = useState(true);
  checkCurrentUser();

  // Set splash screen for 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashScreen(false);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Container>
      {isSplashScreen ? (
        <SplashIcon />
      ) : (
        <button
          onClick={() => {
            firebase.signIn();
          }}
          type="button"
        >
          Sign into Github
        </button>
      )}
    </Container>
  );
});
