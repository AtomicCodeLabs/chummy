/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Split from 'react-split';

import useTheme from '../../hooks/useTheme';
import { RESIZE_GUTTER, NODE } from '../../constants/sizes';
import { SectionContainer } from './index';
import usePrevious from '../../hooks/usePrevious';

const MAX_HEIGHT = 100; // percent

const Container = ({ children, heights, setHeights, isMinimizedArray }) => {
  // Default heights and open/close state
  const defaultHeights = heights || new Array(children.length).fill(0);
  const defaultIsMinimizedArray =
    isMinimizedArray || new Array(children.length).fill(false);
  const prevIsMinimizedArray = usePrevious(defaultIsMinimizedArray);

  const [isDragging, setIsDragging] = useState(false);
  const { spacing } = useTheme();

  // Resize sidebar sections proportionally logic
  useEffect(() => {
    if (!prevIsMinimizedArray) {
      return;
    }
    const prevNumOpen = prevIsMinimizedArray.filter((x) => !x).length;
    const nextNumOpen = defaultIsMinimizedArray.filter((x) => !x).length; // number of sections open next

    // Some edge cases (like when you are closing sections but ultimately you end up opening more sections)
    // aren't considered because the user should be changing the state of at most one section at a time.

    // Add section
    if (prevNumOpen < nextNumOpen) {
      const newSectionSize = MAX_HEIGHT / nextNumOpen;
      const remainingTotalSize =
        MAX_HEIGHT - (nextNumOpen - prevNumOpen) * newSectionSize;

      const newHeights = heights.map((h, i) => {
        // section that wasn't open is now open
        if (prevIsMinimizedArray[i] && !defaultIsMinimizedArray[i]) {
          return Math.round(newSectionSize);
        }
        // section is closed
        if (!prevIsMinimizedArray[i] && defaultIsMinimizedArray[i]) {
          return 0;
        }
        // section remains open
        return Math.round((h * remainingTotalSize) / MAX_HEIGHT);
      });
      setHeights(newHeights);
    }
    // Remove section
    else if (prevNumOpen > nextNumOpen) {
      const totalSizeToRemove = heights.reduce(
        (sumH, h, i) =>
          sumH +
          (!prevIsMinimizedArray[i] && defaultIsMinimizedArray[i] ? h : 0),
        0
      );

      const newHeights = heights.map((h, i) => {
        // section is closed
        if (!prevIsMinimizedArray[i] && defaultIsMinimizedArray[i]) {
          return 0;
        }
        // section remains open
        return Math.round((h * MAX_HEIGHT) / (MAX_HEIGHT - totalSizeToRemove));
      });
      setHeights(newHeights);
    }
  }, [defaultIsMinimizedArray]);

  return (
    <Split
      direction="vertical"
      sizes={defaultHeights}
      style={{ height: '100%' }}
      minSize={NODE.HEIGHT({ theme: { spacing } })}
      gutter={(index, direction) => {
        const gutterContainer = document.createElement('div');
        gutterContainer.className = `gutter gutter-${direction} gutter-container`;
        const gutter = document.createElement('div');
        gutter.className = `custom-gutter`;
        gutterContainer.appendChild(gutter);
        return gutterContainer;
      }}
      gutterStyle={(dimension, gutterSize) => ({
        height: `${gutterSize}px`
      })}
      gutterSize={
        defaultIsMinimizedArray.every((x) => !x) ? RESIZE_GUTTER.HEIGHT : 0
      }
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(sizes) => {
        setIsDragging(false);
        setHeights(sizes);
        // For some reason, drag cursor disappears after first drag
        // https://github.com/nathancahill/split/issues/99
        const gutters = document.getElementsByClassName('gutter-vertical');
        gutters.forEach((gutter) => {
          // eslint-disable-next-line no-param-reassign
          gutter.classList.add('gutter-container');
        });
      }}
    >
      {children &&
        children.map((Section, i) => (
          <SectionContainer key={i} isDragging={isDragging}>
            {Section}
          </SectionContainer>
        ))}
    </Split>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  heights: PropTypes.arrayOf(PropTypes.number),
  setHeights: PropTypes.func.isRequired,
  isMinimizedArray: PropTypes.arrayOf(PropTypes.bool) // array of booleans to indicate sections' open/closed states
};

Container.defaultProps = {
  heights: null,
  isMinimizedArray: null
};

export default {
  Container
};
