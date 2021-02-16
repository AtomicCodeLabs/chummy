// https://codepen.io/ivillamil/pen/dokmG/
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { ICON } from '../../constants/sizes';
import { nodeIconColor, spacerSpacing } from '../../constants/theme';
import { P } from '../Text';

const Spacer = styled.div`
  height: ${spacerSpacing};
`;

const Loader = styled.div`
  & {
    /* animation: loader 5s linear infinite; */
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
  @keyframes loader {
    0% {
      left: -100px;
    }
    100% {
      left: 110%;
    }
  }
  #box {
    width: 50px;
    height: 50px;
    background: ${({ iconColor, ...props }) =>
      iconColor || nodeIconColor(props)};
    animation: animate 0.5s linear infinite;
    border-radius: 3px;
  }
  @keyframes animate {
    17% {
      border-bottom-right-radius: 3px;
    }
    25% {
      transform: translateY(9px) rotate(22.5deg);
    }
    50% {
      transform: translateY(18px) scale(1, 0.9) rotate(45deg);
      border-bottom-right-radius: 40px;
    }
    75% {
      transform: translateY(9px) rotate(67.5deg);
    }
    100% {
      transform: translateY(0) rotate(90deg);
    }
  }
  #shadow {
    margin-top: 9px;
    width: 50px;
    height: 5px;
    background: #000;
    opacity: 0.1;
    border-radius: 50%;
    animation: shadow 0.5s linear infinite;
  }
  @keyframes shadow {
    50% {
      transform: scale(1.2, 1);
    }
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  margin-top: calc(10vh * -1);
  max-width: calc(2 * ${ICON.SPLASH.SIZE}px);
  min-width: calc(1.5 * ${ICON.SPLASH.SIZE}px);
  text-align: center;
`;

const SplashSpinner = ({ text, iconColor }) => {
  return (
    <Container>
      <Loader iconColor={iconColor}>
        <div id="box" />
        <div id="shadow" />
      </Loader>
      {text && (
        <>
          <Spacer />
          <P>{text}</P>
        </>
      )}
    </Container>
  );
};

SplashSpinner.propTypes = {
  text: PropTypes.string,
  iconColor: PropTypes.string
};

SplashSpinner.defaultProps = {
  text: null,
  iconColor: null
};

export default SplashSpinner;
