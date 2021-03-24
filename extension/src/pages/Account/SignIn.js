import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { MarkGithubIcon, PersonIcon } from '@primer/octicons-react';
import loadable from '@loadable/component';

import { Container, Spacer, SignInContainer } from './Signin.style';
import useDAO, { checkCurrentUser } from '../../hooks/dao';
import { useUserStore } from '../../hooks/store';
import IconAndTextButton from '../../components/Buttons/IconAndTextButton';
import { H3, Title, Subtitle } from '../../components/Text';
import { ICON } from '../../constants/sizes';
import useTheme from '../../hooks/useTheme';
import { onSignInComplete } from '../../utils/user';
import Image from '../../components/Image';
import chummyLogo from '../../../public/icon/chummy128.png';

const SplashSpinner = loadable(
  () => import('../../components/Loading/SplashSpinner'),
  {
    fallback: <></>
  }
);

export default observer(() => {
  const dao = useDAO();
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
      dao.signInComplete(payload);
    });
    return removeListener;
  }, []);

  const renderContents = () => {
    if (isPendingLocal || isPending) {
      // TODO: Set a timeout where if it's waiting on auth for too long, it'll
      // suggest the user to go back to signin page
      return <SplashSpinner text="Waiting for authentication..." />;
    }

    // If there was an error signing in
    if (error) {
      return error.message;
    }

    return (
      <>
        <SignInContainer>
          <Image
            // eslint-disable-next-line global-require
            src={chummyLogo}
            size={ICON.SPLASH.SIZE(STPayload)}
            alt="chummy-icon"
            PlaceholderIcon={<PersonIcon />}
          />
          <Title>Chummy</Title>
          <Subtitle>GitHub made easy</Subtitle>
          <Spacer />
          <IconAndTextButton
            Icon={<MarkGithubIcon />}
            iconSize={ICON.SIZE(STPayload) + 4}
            iconOnLeft
            onClick={() => {
              // open new tab and initiate sign in flow
              dao.signIn();
            }}
          >
            <H3>Sign in with GitHub</H3>
          </IconAndTextButton>
        </SignInContainer>
      </>
    );
  };

  return <Container>{renderContents()}</Container>;
});
