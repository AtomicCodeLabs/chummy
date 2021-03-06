/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/forbid-prop-types */
import React, { Suspense, cloneElement } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

import { XIcon } from '@primer/octicons-react';
import { BUTTON, ICON } from '../../constants/sizes';
import {
  fieldBackgroundColor,
  fieldBackgroundLightColor,
  fontSize
} from '../../constants/theme';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding-left: ${BUTTON.SIDE_PADDING}px;
  padding-right: ${BUTTON.SIDE_PADDING}px;

  cursor: pointer;
  font-size: ${fontSize};
  height: ${BUTTON.BIG_HEIGHT}px;
  background-color: ${fieldBackgroundColor};
  &:hover {
    background-color: ${fieldBackgroundLightColor};
  }
`;

const IconContainer = styled.div`
  padding: ${ICON.SIDE_MARGIN}px;
  ${({ iconOnLeft }) =>
    iconOnLeft
      ? css`
          padding-left: 0;
        `
      : css`
          padding-right: 0;
        `}
`;

const ContentContainer = styled.div`
  ${({ iconOnLeft }) =>
    iconOnLeft
      ? css`
          padding-left: ${ICON.SIDE_MARGIN}px;
        `
      : css`
          padding-right: ${ICON.SIDE_MARGIN}px;
        `}
`;

const IconAndTextButton = ({
  style,
  Icon,
  iconSize,
  disabled,
  onClick,
  children,
  iconOnLeft,
  ...buttonProps
}) => {
  const renderContent = () => {
    return [
      <IconContainer iconOnLeft={iconOnLeft} key="icon">
        <Suspense fallback={<XIcon />}>
          {cloneElement(Icon, { size: iconSize })}
        </Suspense>
      </IconContainer>,
      <ContentContainer key="content" iconOnLeft={iconOnLeft}>
        {children}
      </ContentContainer>
    ].slice(iconOnLeft ? 0 : -1);
  };

  return (
    <Container style={style} onClick={onClick} {...buttonProps}>
      {renderContent()}
    </Container>
  );
};
IconAndTextButton.propTypes = {
  style: PropTypes.object,
  Icon: PropTypes.element.isRequired,
  iconSize: PropTypes.number,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired, // contains text nodes
  iconOnLeft: PropTypes.bool
};

IconAndTextButton.defaultProps = {
  style: {},
  iconSize: 24,
  disabled: false,
  onClick: () => {},
  iconOnLeft: false
};

export default IconAndTextButton;
