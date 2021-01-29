import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { XIcon } from '@primer/octicons-react';

import { NotificationType } from '../../config/store/I.ui.store.ts';
import {
  errorColor,
  fontSize,
  infoColor,
  successColor,
  warningColor
} from '../../constants/theme';
import {
  nodePadding,
  nodeHeight,
  RightIconContainer,
  Icon,
  MiddleSpacer
} from '../Node/Base.style';
import useTheme from '../../hooks/useTheme';
import { ICON } from '../../constants/sizes';
import { WHITE } from '../../constants/colors';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  ${nodePadding};
  height: ${nodeHeight};

  ${({ type, ...props }) => {
    switch (type) {
      case NotificationType.Success:
        return css`
          background-color: ${successColor(props)};
        `;
      case NotificationType.Error:
        return css`
          background-color: ${errorColor(props)};
        `;
      case NotificationType.Warning:
        return css`
          background-color: ${warningColor(props)};
        `;
      case NotificationType.Info:
      default:
        return css`
          background-color: ${infoColor(props)};
        `;
    }
  }}

  .title {
  }

  .message {
    font-size: ${fontSize};
    color: ${WHITE};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  svg {
    fill: ${WHITE};
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
