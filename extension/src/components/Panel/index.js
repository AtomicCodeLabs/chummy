import React from 'react';
import PropTypes from 'prop-types';
import StyledPanel from './style';

const Panel = ({
  title,
  description,
  children,
  highlightOnHover,
  evenPadding,
  center,
  onClick,
  rightPanel,
  flag
}) => {
  return (
    <StyledPanel.Container
      highlightOnHover={highlightOnHover}
      evenPadding={evenPadding}
      onClick={onClick}
    >
      <StyledPanel.LeftPanel>
        {title && (
          <StyledPanel.Title>
            <span className={flag ? 'strikethrough' : undefined}>{title}</span>
            <span>{flag}</span>
          </StyledPanel.Title>
        )}
        {description && (
          <StyledPanel.Description isLast={!children}>
            {description}
          </StyledPanel.Description>
        )}
        <StyledPanel.Content center={center}>{children}</StyledPanel.Content>
      </StyledPanel.LeftPanel>
      {rightPanel && (
        <StyledPanel.RightPanel>{rightPanel}</StyledPanel.RightPanel>
      )}
    </StyledPanel.Container>
  );
};

Panel.propTypes = {
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node,
  highlightOnHover: PropTypes.bool,
  evenPadding: PropTypes.bool,
  center: PropTypes.bool,
  onClick: PropTypes.func,
  rightPanel: PropTypes.node,
  flag: PropTypes.node
};

Panel.defaultProps = {
  title: null,
  description: null,
  children: null,
  highlightOnHover: true,
  evenPadding: false,
  center: false,
  onClick: null,
  rightPanel: null, // Contents of right panel if a vertical split is wanted
  flag: null // Flag next to title
};

export default Panel;
