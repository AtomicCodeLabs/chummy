import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ChevronRightIcon } from '@primer/octicons-react';
import { NODE } from '../constants/sizes';

const Container = styled.div`
  width: 16px;
  height: 16px;
  line-height: ${NODE.HEIGHT}px;
  svg {
    transform: rotate(${({ open }) => (open ? 90 : 0)}deg);
  }
`;

const OpenCloseChevron = ({ open, onClick }) => {
  return (
    <Container open={open} onClick={onClick}>
      <ChevronRightIcon />
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
