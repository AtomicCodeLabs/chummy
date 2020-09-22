import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ChevronRightIcon } from '@primer/octicons-react';
import { NODE } from '../constants/sizes';
import { nodeIconColor } from '../constants/theme';

const Container = styled.div`
  /* width: 14px;
  height: 14px; */
  /* line-height: ${NODE.HEIGHT}px; */
  display: flex;
  align-items: center;
  svg {
    fill: ${nodeIconColor};
    transform: rotate(${({ open }) => (open ? 90 : 0)}deg);
  }
`;

const OpenCloseChevron = ({ open, onClick }) => {
  return (
    <Container open={open} onClick={onClick}>
      <ChevronRightIcon size={14} verticalAlign="middle" />
    </Container>
  );
};

OpenCloseChevron.propTypes = {
  open: PropTypes.bool,
  onClick: PropTypes.func
};

OpenCloseChevron.defaultProps = {
  open: false,
  onClick: () => {}
};

export default OpenCloseChevron;
