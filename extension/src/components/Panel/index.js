import React from 'react';
import PropTypes from 'prop-types';
import StyledPanel from './style';
import {
  lightTextColor,
  textColor,
  backgroundColor
} from '../../constants/theme';

const Panel = ({
  title,
  description,
  children,
  highlightOnHover,
  evenPadding,
  center,
  onClick,
  rightPanel,
  flag,
  borderLeftColor,
  backgroundColor: bgColor,
  closable,
  borderRadius,
  titlefontColor,
  descriptionFontColor
}) => {
  return (
    <StyledPanel.Container
      onClick={onClick}
      highlightOnHover={highlightOnHover}
      borderLeftColor={borderLeftColor}
      borderRadius={borderRadius}
      fontColor={titlefontColor}
      evenPadding={evenPadding}
      bgColor={bgColor}
    >
      <StyledPanel.LeftPanel>
        {title && (
          <StyledPanel.Title fontColor={titlefontColor}>
            <span className={flag ? 'strikethrough' : undefined}>{title}</span>
            <span>{flag}</span>
          </StyledPanel.Title>
        )}
        {closable && 'closable'}
        {description && (
          <StyledPanel.Description
            isLast={!children}
            fontColor={descriptionFontColor}
          >
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
  flag: PropTypes.node,
  borderLeftColor: PropTypes.func,
  backgroundColor: PropTypes.func,
  closable: PropTypes.bool,
  borderRadius: PropTypes.string,
  titlefontColor: PropTypes.func,
  descriptionFontColor: PropTypes.func
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
  flag: null, // Flag next to title,
  borderLeftColor: null,
  backgroundColor,
  closable: false, // Has x icon on top right
  borderRadius: '0',
  titlefontColor: textColor,
  descriptionFontColor: lightTextColor
};

export default Panel;
