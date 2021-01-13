import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { ChevronRightIcon } from '@primer/octicons-react';
import { nodeIconColor, fieldBackgroundColor } from '../constants/theme';
import { ICON } from '../constants/sizes';
import useTheme from '../hooks/useTheme';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-right: ${ICON.SIDE_MARGIN}px;

  svg {
    fill: ${nodeIconColor};
    transition: transform 100ms;
    transform: rotate(${({ startDeg }) => startDeg}deg);
    ${({ noRotate }) =>
      !noRotate &&
      css`
        transform: rotate(
          ${({ startDeg, open }) => (open ? 90 + startDeg : startDeg)}deg
        );
      `}
  }

  ${({ highlightOnHover }) =>
    highlightOnHover &&
    css`
      &:hover {
        background-color: ${fieldBackgroundColor};
      }
    `}
`;

const OpenCloseChevron = ({
  open,
  onClick,
  highlightOnHover,
  Icon,
  noRotate,
  startDeg
}) => {
  const { spacing } = useTheme();
  return (
    <Container
      open={open}
      onClick={onClick}
      highlightOnHover={highlightOnHover}
      noRotate={noRotate}
      startDeg={startDeg}
    >
      {cloneElement(Icon, {
        size: ICON.SIZE({ theme: { spacing } }),
        verticalAlign: 'middle'
      })}
    </Container>
  );
};

OpenCloseChevron.propTypes = {
  open: PropTypes.bool,
  onClick: PropTypes.func,
  highlightOnHover: PropTypes.bool,
  Icon: PropTypes.node,
  startDeg: PropTypes.number,
  noRotate: PropTypes.bool
};

OpenCloseChevron.defaultProps = {
  open: false,
  onClick: () => {},
  highlightOnHover: false,
  Icon: <ChevronRightIcon />,
  startDeg: 0,
  noRotate: false
};

export default OpenCloseChevron;
