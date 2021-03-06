import styled from 'styled-components';

import { spacerSpacing } from '../../constants/theme';
import { ICON } from '../../constants/sizes';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

export const SignInContainer = styled.div`
  padding: 1rem;
  margin-top: calc(15vh * -1);
  max-width: calc(2 * ${ICON.SPLASH.SIZE}px);
  min-width: calc(1.5 * ${ICON.SPLASH.SIZE}px);
  text-align: center;
`;

export const Spacer = styled.div`
  height: ${spacerSpacing};
`;
