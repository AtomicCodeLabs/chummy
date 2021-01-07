import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { MarkGithubIcon } from '@primer/octicons-react';

import SplashSpinner from '../../components/Loading/SplashSpinner';
import useFirebaseDAO, { checkCurrentUser } from '../../hooks/firebase';
import { useUserStore } from '../../hooks/store';
import IconAndTextButton from '../../components/Buttons/IconAndTextButton';
import { H3 } from '../../components/Text';
import { ICON } from '../../constants/sizes';
import useTheme from '../../hooks/useTheme';
import { onSignInComplete } from '../../utils/user';

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

  // States: isPending, isSplashScreen, isWaiting
  const [isPendingLocal, setPendingLocal] = useState(true);
  const { error, isPending } = useUserStore();
  useEffect(() => {
    setPendingLocal(isPending);
  }, [isPending]);

  // First thing to do is check if there is a user currently signed in
  checkCurrentUser();

  // Set splash screen for 1 second on startup to give buffer time to check user
  useEffect(() => {
    const timer = setTimeout(() => {
      setPendingLocal(false);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // set listener for sign in complete messages from bg
  useEffect(() => {
    const removeListener = onSignInComplete((payload) => {
      firebase.signInComplete(payload);
    });
    return removeListener;
  }, []);

  const renderContents = () => {
    if (isPendingLocal || isPending) {
      return <SplashSpinner />;
    }

    // If there was an error signing in
    if (error) {
      return 'Error';
    }

    return (
      <>
        <SignInContainer>
          <IconAndTextButton
            Icon={<MarkGithubIcon />}
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

  return <Container>{renderContents()}</Container>;
});
