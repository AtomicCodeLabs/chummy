import React from 'react';
import PropTypes from 'prop-types';

import StyledPanel from './style';

const Panel = ({ title, description, children }) => {
  return (
    <StyledPanel.Container>
      <StyledPanel.Title>{title}</StyledPanel.Title>
      <StyledPanel.Description>{description}</StyledPanel.Description>
      {children}
    </StyledPanel.Container>
  );
};

Panel.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired
};

export default Panel;
