import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { sidebarInactiveIconColor } from '../../constants/theme';

const Container = styled.div`
  position: absolute;
`;

const SubContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: -${({ bottom }) => bottom}px;
  right: -${({ right }) => right}px;

  ${({ subIconColor, active, ...props }) =>
    css`
      svg {
        fill: ${subIconColor(props)} !important;
        opacity: ${active ? 1 : 0.5};
        position: absolute;
      }
    `}
`;

const IconWithSubIcon = ({ Icon, SubIcon, offsetY, offsetX }) => {
  const {
    subIconColor = sidebarInactiveIconColor,
    active = false
  } = SubIcon.props;
  return (
    <Container>
      {Icon}
      <SubContainer
        bottom={offsetY}
        right={offsetX}
        active={active}
        subIconColor={subIconColor}
      >
        {SubIcon}
      </SubContainer>
    </Container>
  );
};

IconWithSubIcon.propTypes = {
  Icon: PropTypes.node.isRequired,
  SubIcon: PropTypes.node.isRequired,
  offsetY: PropTypes.number,
  offsetX: PropTypes.number
};

IconWithSubIcon.defaultProps = {
  offsetY: 0,
  offsetX: 0
};

export default IconWithSubIcon;
