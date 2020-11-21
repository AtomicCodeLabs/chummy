/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { ResizableBox } from 'react-resizable';

import useTheme from '../../hooks/useTheme';
import { RESIZE_GUTTER, NODE, HEADER, SIDE_TAB } from '../../constants/sizes';
import { SectionContainer } from './index';
import { backgroundHighlightColor, shadowColor } from '../../constants/theme';

export const DEFAULT_REOPEN_HEIGHT = 200;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: calc(100vh - ${HEADER.HEIGHT}px);
`;

const StyledResizableBox = styled(
  ({ isLast, isDragging, isCollapsed, ...props }) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <ResizableBox {...props} />
  )
)`
  position: relative;
  width: 100% !important;
  ${({ isCollapsed, isLast }) =>
    !isCollapsed &&
    isLast &&
    css`
      height: 100% !important;
    `}
`;

const ResizeHandle = styled.div`
  width: calc(100vw - ${SIDE_TAB.WIDTH}px);
  height: ${RESIZE_GUTTER.HEIGHT}px;
  border-bottom: 1px solid ${shadowColor};
  bottom: calc(${RESIZE_GUTTER.HEIGHT}px + 1px); /* + 1 for border */
  position: relative;
  background-color: transparent;
  cursor: row-resize;
  transition: border-bottom-color 200ms;

  &:hover {
    border-bottom-color: ${backgroundHighlightColor};
  }
`;

const Container = ({ children, heights, isMinimizedArray }) => {
  const { spacing, theme: mode } = useTheme();
  const STPayload = { theme: { theme: mode, spacing } };
  const NODE_HEIGHT = NODE.HEIGHT(STPayload);

  // Default heights and open/close state
  const defaultHeights =
    heights || new Array(children.length).fill(NODE_HEIGHT);
  const defaultIsMinimizedArray =
    isMinimizedArray || new Array(children.length).fill(false);

  const [isDragging, setIsDragging] = useState(false);

  return (
    <StyledContainer>
      {children &&
        children.map((_Section, i) => {
          const isCollapsed = defaultIsMinimizedArray[i];
          const isLast = i === children.length - 1;
          const { onResizeStop } = _Section.props;
          return (
            <StyledResizableBox
              key={i}
              axis="y"
              width={Infinity}
              height={isCollapsed ? NODE.HEIGHT(STPayload) : defaultHeights[i]}
              isCollapsed={isCollapsed}
              isLast={isLast}
              isDragging={isDragging}
              handle={<ResizeHandle />}
              resizeHandles={isLast ? [] : ['s']}
              minConstraints={[Infinity, 3 * NODE_HEIGHT]}
              maxConstraints={[Infinity, Infinity]}
              onResizeStart={() => {
                setIsDragging(true);
              }}
              onResizeStop={(e, { size: { height } }) => {
                setIsDragging(false);
                onResizeStop(height);
              }}
            >
              <SectionContainer>{_Section.props.children}</SectionContainer>
            </StyledResizableBox>
          );
        })}
    </StyledContainer>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  heights: PropTypes.arrayOf(PropTypes.number),
  isMinimizedArray: PropTypes.arrayOf(PropTypes.bool) // array of booleans to indicate sections' open/closed states
};

Container.defaultProps = {
  heights: null,
  isMinimizedArray: null
};

export default {
  Container
};
