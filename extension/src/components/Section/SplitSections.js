/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-underscore-dangle */
// Sandboxed here: https://codesandbox.io/s/resizable-panels-pl5fn
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ResizableBox } from 'react-resizable';

import { HEADER, RESIZE_GUTTER, NODE } from '../../constants/sizes';
import useDimension from '../../hooks/useDimension';
import useDebounce from '../../hooks/useDebounce';
import useTheme from '../../hooks/useTheme';
import { backgroundHighlightColor } from '../../constants/theme';

const StyledContainer = styled.div`
  display: flex;
  height: calc(100vh - ${HEADER.HEIGHT}px);
  flex-direction: column;
  justify-content: flex-start;

  .react-resizable {
    position: relative;
  }
`;

const ResizeHandler = styled.div`
  width: 100%;
  height: ${RESIZE_GUTTER.HEIGHT}px;
  position: absolute;
  bottom: 0px;
  border-bottom: 1px solid transparent;
  cursor: row-resize;
  z-index: 4;
  transition: border-bottom-color 200ms;

  &:hover {
    border-bottom-color: ${backgroundHighlightColor};
  }
`;

const SplitSections = ({
  children,
  heights,
  minimized,
  setHeights: setHeightsCallback // not used, but can be if outside state needs to be controlled from inside this component
}) => {
  const { spacing } = useTheme();

  /* Constants */
  const NODE_CLOSED_HEIGHT = NODE.HEIGHT({ theme: { spacing } }); // height that closed section takes up
  const NODE_MIN_HEIGHT = NODE_CLOSED_HEIGHT * 3; // min-height that open section takes up
  const N = children.length; // number of all sections
  const MIN_CONTAINER_H = 75 * N;
  // KEEP N_OPEN and N_CLOSED updated
  const N_OPEN = useMemo(() => minimized.filter((s) => !s).length, [minimized]); // number of open sections
  const N_CLOSED = useMemo(() => minimized.filter((s) => s).length, [
    minimized
  ]); // number of closed sections

  /* States */

  // Only include non minimized section heights in _heights so that
  // minimized heights are ignored in calculations. When a minimized
  // section is opened, include that section's last seen height in _heights.
  const [_heights, _setHeights] = useState(
    heights.length
      ? heights.filter((_h, i) => !minimized[i])
      : new Array(N_OPEN).fill(NODE_MIN_HEIGHT)
  );
  const [_minimized, setMinimized] = useState(
    minimized.length ? minimized : new Array(N_OPEN).fill(false)
  );
  const _heightsDebounced = useDebounce(_heights, 500);
  const [containerRef, { height: containerH }] = useDimension();
  const [topBoundIndex, setTopBoundIndex] = useState(0);
  const [bottomBoundIndex, setBottomBoundIndex] = useState(N_OPEN - 1);

  // When setting heights, call both local and parent's callback
  const setHeights = (_heightsToSet) => {
    _setHeights(_heightsToSet);
    // setHeights(_heightsToSet)
  };

  /* Lifecycle */

  // Keep _heights and _minimized updated with props
  useEffect(() => {
    if (heights.length) {
      setHeights(heights.filter((_h, i) => !minimized[i]));
    }
    if (minimized.length) {
      setMinimized(minimized);
    }
  }, [heights, minimized]);

  const fillHeights = (newHeights) => {
    // Fill out _heights so they take up 100% height
    const heightsExceptLast = newHeights.slice(0, -1);

    // Add up all the other sections + space minimized sections take up
    const sumRest =
      heightsExceptLast.reduce((sumH, h) => sumH + h, 0) +
      NODE_CLOSED_HEIGHT * N_CLOSED;

    // Set bottom bound section to take up rest of container
    const lastHeight = Math.max(containerH - sumRest, NODE_MIN_HEIGHT);

    return [...heightsExceptLast, lastHeight];
  };

  const resolveHeights = (nextH, i) => {
    // When dragging south handler down, resize section below accordingly so that
    // sections don't shift down
    const diffY = nextH - _heights[i];

    // If diffY is negative and current section at
    // its minimium, start decreasing previous section
    // height and increasing current section by same
    if (diffY < 0 && i !== 0 && _heights[i] <= NODE_MIN_HEIGHT) {
      // Find first element starting from left of current section
      // that isn't at minimum value.
      const iOfMinimizableSection =
        i - // subtract because we find index by reversing array and searching
        1 -
        _heights
          .slice(0, i)
          .reverse()
          .findIndex((h) => h > NODE_MIN_HEIGHT);

      // If all sections before current one are minimized
      if (iOfMinimizableSection === i) {
        return fillHeights([
          ..._heights.slice(0, i),
          NODE_MIN_HEIGHT,
          ..._heights.slice(i + 1)
        ]);
      }

      return fillHeights([
        ..._heights.slice(0, iOfMinimizableSection), // everything before section to minimize
        Math.max(_heights[iOfMinimizableSection] + diffY, NODE_MIN_HEIGHT), // section to minimize
        ..._heights.slice(iOfMinimizableSection + 1, i), // everything between section to minimize and current section
        NODE_MIN_HEIGHT, // current section
        _heights[i + 1] - diffY, // next section expands
        ...(i >= N_OPEN - 2 ? [] : _heights.slice(i + 2)) // everything after next section
      ]);
    }

    // If diffY is negative and current section isn't at it's minimum,
    // decrease current section and increase next section by the same
    // amount so that sections stay in place when handlers are moved
    // up
    if (diffY < 0 && _heights[i] > NODE_MIN_HEIGHT) {
      return fillHeights([
        ..._heights.slice(0, i),
        Math.max(_heights[i] + diffY, NODE_MIN_HEIGHT),
        _heights[i + 1] - diffY,
        ...(i >= N_OPEN - 2 ? [] : _heights.slice(i + 2))
      ]);
    }

    // Else if a diffY is 0 or positive, we can assume a section is
    // being expanded. We do something similar, and find the most
    // minimizable section after current section.
    const iOfMinimizableSection =
      i + 1 + _heights.slice(i + 1).findIndex((h) => h > NODE_MIN_HEIGHT);

    // If all sections after current one are minimized, expand last section
    // to fill height
    if (iOfMinimizableSection === i) {
      return fillHeights([
        ..._heights.slice(0, i),
        nextH, // keep at current height, because can't expand anymore
        ..._heights.slice(i + 1)
      ]);
    }

    return fillHeights([
      ..._heights.slice(0, i), // everything before current section
      nextH, // current section
      ..._heights.slice(i + 1, iOfMinimizableSection), // everything between current section and section to minimize
      Math.max(_heights[iOfMinimizableSection] - diffY, NODE_MIN_HEIGHT), // subtract diff resized from last state from next section
      ..._heights.slice(iOfMinimizableSection + 1) // everything after minimizable section
    ]);
  };

  const setHeight = (h, i) => {
    const filledHeights = resolveHeights(h, i);
    setHeights(filledHeights);
  };

  // If container is resized (window resize) or minimized state
  // changes, fill out heights
  useEffect(() => {
    if (containerH) {
      const newHeights = fillHeights(_heights);
      setHeights(newHeights);
    }
  }, [containerH, _minimized]);

  // Keeps topBoundIndex and bottomBoundIndex updated whenever _heights change
  // so that you can't expand sections offscreen
  useEffect(() => {
    // Update top bound index
    const nextTopIndex = Math.max(
      _heights.slice().findIndex((h) => h > NODE_MIN_HEIGHT) - 1,
      0
    );
    if (nextTopIndex !== topBoundIndex) {
      setTopBoundIndex(nextTopIndex);
    }

    // Update bottom bound index
    const nextBottomIndex = Math.min(
      N_OPEN -
        1 -
        _heights
          .slice()
          .reverse()
          .findIndex((h) => h > NODE_MIN_HEIGHT),
      N_OPEN - 1
    );
    if (nextBottomIndex !== bottomBoundIndex) {
      setBottomBoundIndex(nextBottomIndex);
    }
  }, [_heights]);

  // Recalibrate in case diff is too large
  useEffect(() => {
    // Ignore if container height is less than MIN_CONTAINER_H to avoid
    // recursive loop
    if (!containerH || containerH < MIN_CONTAINER_H) {
      return;
    }
    // Sum of rest of heights + space minimized sections take up
    const sumOfHeights =
      _heights.reduce((sumH, h) => sumH + h, 0) + NODE_CLOSED_HEIGHT * N_CLOSED;
    if (sumOfHeights > containerH) {
      // Resize only height above minimal height to fit container
      setHeights([
        ..._heights.slice(0, bottomBoundIndex),
        Math.max(
          containerH - sumOfHeights + _heights[bottomBoundIndex],
          NODE_MIN_HEIGHT
        ),
        ..._heights.slice(bottomBoundIndex + 1)
      ]);
    }
  }, [_heights]);

  // On resize stop, call onResizeStop callback. Primarily used to set lastHeights
  // of each section in uiStore
  useEffect(() => {
    // If new height is different from the heights that was passed in, call
    // the corresponding callback
    let _i = 0; // index of _heights
    heights.forEach((h, i) => {
      // If section is open, height is eligible to be updated in ui store
      if (!minimized[i]) {
        children[i].props.onResizeStop(_heights[_i]);
        _i += 1; // increment local _i to keep it updated relative to i
      }
    });
  }, [_heightsDebounced]);

  return (
    <StyledContainer ref={containerRef}>
      {children &&
        children.map((_Section, i) => {
          const { children: c } = _Section.props;

          // Handle closed sections. Still keep as resizable boxes but without handle
          // and callbacks
          if (_minimized[i]) {
            return (
              <ResizableBox
                width={Infinity}
                height={NODE_CLOSED_HEIGHT}
                axis="y"
                minConstraints={[Infinity, NODE_CLOSED_HEIGHT]}
                maxConstraints={[Infinity, NODE_CLOSED_HEIGHT]}
                resizeHandles={[]}
                key={i}
              >
                {c}
              </ResizableBox>
            );
          }

          // i relative to _heights. Remember, 0 <=_heights.length <= heights.length
          // the subtrahend is the count of closed sections before the current section
          const _i =
            i -
            _minimized
              .slice(0, i)
              .reduce(
                (countClosed, isClosed) => countClosed + (isClosed ? 1 : 0),
                0
              );
          const shouldHaveMinConstraint =
            _i === 0 || _i === N_OPEN - 1 || _i === topBoundIndex;
          const shouldHaveMaxConstraint = _i === bottomBoundIndex;
          return (
            <ResizableBox
              width={Infinity}
              height={_heights[_i]}
              axis="y"
              minConstraints={[
                Infinity,
                shouldHaveMinConstraint ? NODE_MIN_HEIGHT : 0
              ]}
              maxConstraints={[
                Infinity,
                shouldHaveMaxConstraint ? _heights[_i] : Infinity
              ]}
              handle={() => <ResizeHandler />}
              resizeHandles={_i === N_OPEN - 1 ? [] : ['s']}
              handleSize={[20, 20]}
              key={i}
              onResize={(e, d) => {
                setHeight(d.size.height, _i);
              }}
            >
              {c}
            </ResizableBox>
          );
        })}
    </StyledContainer>
  );
};

SplitSections.propTypes = {
  children: PropTypes.node.isRequired,
  heights: PropTypes.arrayOf(PropTypes.number),
  minimized: PropTypes.arrayOf(PropTypes.bool),
  setHeights: PropTypes.func
};

SplitSections.defaultProps = {
  heights: [],
  minimized: [],
  setHeights: () => {}
};

export default SplitSections;
