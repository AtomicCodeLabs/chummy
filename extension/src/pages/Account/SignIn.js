import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { OctofaceIcon } from '@primer/octicons-react';

import SplashSpinner from '../../components/Loading/SplashSpinner';
import useFirebaseDAO, { checkCurrentUser } from '../../hooks/firebase';
import { useUserStore } from '../../hooks/store';
import IconAndTextButton from '../../components/Buttons/IconAndTextButton';
import { H3 } from '../../components/Text';
import { ICON } from '../../constants/sizes';
import useTheme from '../../hooks/useTheme';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

const SignInContainer = styled.div`
  padding: 1rem;
`;

export default observer(() => {
  const firebase = useFirebaseDAO();
  const { theme: mode, spacing } = useTheme();
  const STPayload = { theme: { mode, spacing } };
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
      console.log('ERROR', error);
      return 'Error';
    }

    return (
      <>
        <SignInContainer>
          <IconAndTextButton
            Icon={<OctofaceIcon />}
            iconSize={ICON.SIZE(STPayload) + 4}
            onClick={() => {
              firebase.signIn();
            }}
          >
            <H3>Sign in with Github</H3>
          </IconAndTextButton>
        </SignInContainer>
      </>
    );
  };

  console.log('splash', isSplashScreen);
  console.log('pending', isPending);
  console.log('error', error);

  return <Container>{renderContents()}</Container>;
});
