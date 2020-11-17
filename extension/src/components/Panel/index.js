import React from 'react';
import PropTypes from 'prop-types';
import StyledPanel from './style';

const Panel = ({
  title,
  description,
  children,
  highlightOnHover,
  evenPadding,
  center
}) => {
  return (
    <StyledPanel.Container
      highlightOnHover={highlightOnHover}
      evenPadding={evenPadding}
      center={center}
    >
      {title && <StyledPanel.Title>{title}</StyledPanel.Title>}
      {description && (
        <StyledPanel.Description isLast={!children}>
          {description}
        </StyledPanel.Description>
      )}
      {children}
    </StyledPanel.Container>
  );
};

Panel.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node,
  highlightOnHover: PropTypes.bool,
  evenPadding: PropTypes.bool,
  center: PropTypes.bool
};

Panel.defaultProps = {
  title: null,
  description: null,
  children: null,
  highlightOnHover: true,
  evenPadding: false,
  center: false
};

export default Panel;
