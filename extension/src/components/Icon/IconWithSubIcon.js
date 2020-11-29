import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div`
  position: relative;
`;

const SubContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: -${({ bottom }) => bottom}px;
  right: -${({ right }) => right}px;

  ${({ color, active }) =>
    color &&
    css`
      svg {
        fill: ${color} !important;
        opacity: ${active ? 1 : 0.5};
      }
    `}
`;

const IconWithSubIcon = ({ Icon, SubIcon, subtext, offsetY, offsetX }) => {
  const { color, active = false } = SubIcon.props;
  return (
    <Container>
      {Icon}
      <SubContainer
        bottom={offsetY}
        right={offsetX}
        color={color}
        active={active}
      >
        {SubIcon}
        {subtext}
      </SubContainer>
    </Container>
  );
};

IconWithSubIcon.propTypes = {
  Icon: PropTypes.node.isRequired,
  SubIcon: PropTypes.node.isRequired,
  subtext: PropTypes.string,
  offsetY: PropTypes.number,
  offsetX: PropTypes.number
};

IconWithSubIcon.defaultProps = {
  subtext: '',
  offsetY: 10,
  offsetX: 5
};

export default IconWithSubIcon;
