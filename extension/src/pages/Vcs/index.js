import React from 'react';
import styled from 'styled-components';
import theme from 'styled-theming';
import { observer } from 'mobx-react-lite';

import { FlagIcon } from '../../components/Icon/Icons';
import { H2, P } from '../../components/Text';
import { checkCurrentUser } from '../../hooks/dao';
import useTheme from '../../hooks/useTheme';
import { flagIconColor } from '../../constants/theme';
import { ICON } from '../../constants/sizes';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const innerPadding = theme('spacing', {
  compact: '0.6rem',
  cozy: '0.8rem',
  comfortable: '1.2rem'
});

const SplashContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: left;
  box-sizing: border-box;

  padding: ${innerPadding};
  width: 100%;
  max-width: 300px;
`;

export default observer(() => {
  checkCurrentUser();
  const { theme: mode, spacing } = useTheme();
  const STPayload = { theme: { theme: mode, spacing } };

  return (
    <Container>
      <SplashContainer>
        <FlagIcon
          color={flagIconColor(STPayload)}
          size={ICON.SPLASH.SIZE(STPayload)}
        />
        <H2 center>Code Review is currently in development.</H2>
        <P>
          Manage pull requests, track file changes, comments, approvals, and
          everything code review related from one place. Stay tuned for its
          upcoming debut!
        </P>
      </SplashContainer>
    </Container>
  );
});
