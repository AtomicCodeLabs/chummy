/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { redirectToUrl } from '../utils/browser';

const Container = styled.div`
  cursor: pointer;
`;

const ExternalLink = ({ to, children, ...props }) => {
  const handleClick = () => {
    redirectToUrl(to);
  };
  return (
    <Container onClick={handleClick} {...props}>
      {children}
    </Container>
  );
};

ExternalLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default ExternalLink;
