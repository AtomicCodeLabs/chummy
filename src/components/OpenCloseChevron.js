import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { ChevronRightIcon } from '@primer/octicons-react';
import { nodeIconColor, fieldColor } from '../constants/theme';
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
    transform: rotate(${({ open }) => (open ? 90 : 0)}deg);
  }

  ${({ highlightOnHover }) =>
    highlightOnHover &&
    css`
      &:hover {
        background-color: ${fieldColor};
      }
    `}
`;

const OpenCloseChevron = ({ open, onClick, highlightOnHover }) => {
  const { spacing } = useTheme();
  return (
    <Container
      open={open}
      onClick={onClick}
      highlightOnHover={highlightOnHover}
    >
      <ChevronRightIcon
        size={ICON.SIZE({ theme: { spacing } })}
        verticalAlign="middle"
      />
    </Container>
  );
};

OpenCloseChevron.propTypes = {
  open: PropTypes.bool,
  onClick: PropTypes.func,
  highlightOnHover: PropTypes.bool
};

OpenCloseChevron.defaultProps = {
  open: false,
  onClick: () => {},
  highlightOnHover: false
};

export default OpenCloseChevron;
