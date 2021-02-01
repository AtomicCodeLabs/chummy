import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { XIcon } from '@primer/octicons-react';

import {
  contrastTextColor,
  fontSize,
  notificationTypeToColor
} from '../../constants/theme';
import {
  nodePaddingY,
  nodePaddingX,
  RightIconContainer,
  Icon,
  MiddleSpacer
} from '../Node/Base.style';
import useTheme from '../../hooks/useTheme';
import { ICON } from '../../constants/sizes';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  ${nodePaddingX};
  padding-top: 0;
  padding-bottom: 0;
  z-index: 10;

  background-color: ${({ type, ...props }) =>
    notificationTypeToColor[type](props)};

  .title {
  }

  .message {
    font-size: ${fontSize};
    color: ${contrastTextColor};
    ${nodePaddingY};
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  svg {
    fill: ${contrastTextColor};
  }
`;

const Toast = ({ notification, removeNotification }) => {
  const { type, message } = notification;
  const { spacing } = useTheme();

  const handleClick = () => {
    removeNotification(notification);
  };

  return (
    <Container type={type}>
      <div className="message">{message}</div>
      <MiddleSpacer />
      <RightIconContainer>
        <Icon onClick={handleClick}>
          <XIcon
            size={ICON.SIZE({ theme: { spacing } })}
            verticalAlign="middle"
          />
        </Icon>
      </RightIconContainer>
    </Container>
  );
};

Toast.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    message: PropTypes.string
  }).isRequired,
  removeNotification: PropTypes.func
};

Toast.defaultProps = {
  removeNotification: () => {}
};

export default Toast;
