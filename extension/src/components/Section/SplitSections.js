/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { ResizableBox } from 'react-resizable';

import useTheme from '../../hooks/useTheme';
import { RESIZE_GUTTER, NODE, HEADER, SIDE_TAB } from '../../constants/sizes';
import { SectionContainer } from './index';
import { backgroundHighlightColor } from '../../constants/theme';
import useDimension from '../../hooks/useDimension';

export const DEFAULT_REOPEN_HEIGHT = 200;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  height: calc(100vh - ${HEADER.HEIGHT}px);
`;

const StyledResizableBox = styled(
  ({ isFirstOpened, isDragging, isCollapsed, minTopOffset, ...props }) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <ResizableBox {...props} />
  )
)`
  position: sticky;
  top: calc(${({ minTopOffset }) => minTopOffset}px + ${HEADER.HEIGHT}px);
  width: 100% !important;
  // background-color: lightblue;
  // min-height: calc(3 * ${NODE.HEIGHT}px);
  ${({ isCollapsed, isFirstOpened }) =>
    !isCollapsed &&
    isFirstOpened &&
    css`
      height: 100% !important;
    `}
`;

const ResizeHandle = styled.div`
  width: calc(100vw - ${SIDE_TAB.WIDTH}px);
  height: ${RESIZE_GUTTER.HEIGHT}px;
  border-bottom: 1px solid transparent;
  top: calc(-${RESIZE_GUTTER.HEIGHT}px - 1px); /* + 1 for border */
  position: absolute;
  background-color: transparent;
  cursor: row-resize;
  transition: border-bottom-color 200ms;
  z-index: 5;

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
  const [containerRef, { height: containerHeight }] = useDimension();
  const [firstSectionRef, { height: firstSectionHeight }] = useDimension();

  console.log(isDragging, containerHeight);

  useEffect(() => {
    // Keep first section height state updated
    if (firstSectionRef.current) {
      console.log('first height', firstSectionHeight);
      children[0].props.onResizeStop(firstSectionHeight);
    }
  }, [firstSectionRef.current, firstSectionHeight]);

  return (
    <StyledContainer ref={containerRef}>
      {children &&
        children.map((_Section, i) => {
          const isCollapsed = defaultIsMinimizedArray[i];
          const isFirstOpened =
            i === 0 || defaultIsMinimizedArray.findIndex((m) => !m) === i;
          const newHeight = isCollapsed ? NODE_HEIGHT : defaultHeights[i];
          const minTopOffset = defaultHeights
            .slice(0, i)
            .reduce(
              (sumH, h, j) =>
                sumH +
                (defaultIsMinimizedArray[j] ? NODE_HEIGHT : 3 * NODE_HEIGHT),
              0
            );
          /* if (isFirstCollapsed && i === 1) {
            newHeight = defaultHeights[0] + defaultHeights[1] - NODE_HEIGHT;
            onResizeStop(newHeight)
          } */
          const { onResizeStop } = _Section.props;
          return (
            <StyledResizableBox
              key={i}
              axis="y"
              minTopOffset={minTopOffset}
              ref={firstSectionRef}
              width={Infinity}
              height={newHeight}
              isCollapsed={isCollapsed}
              isFirstOpened={isFirstOpened}
              handle={<ResizeHandle />}
              resizeHandles={i === 0 || isCollapsed ? [] : ['n']}
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
              <SectionContainer ref={i === 0 ? firstSectionRef : null}>
                {_Section.props.children}
              </SectionContainer>
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
