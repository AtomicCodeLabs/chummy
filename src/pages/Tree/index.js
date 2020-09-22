import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Scrollbars } from 'react-custom-scrollbars';
import Split from 'react-split';

import {
  SectionContainer,
  SectionNameContainer,
  SectionName,
  SectionContent
} from './style';
import OpenCloseChevron from '../../components/OpenCloseChevron';
import { checkCurrentUser } from '../../hooks/firebase';
import { useUiStore } from '../../hooks/store';
import getFolderFiles from '../../hooks/getFolderFiles';
import Node from '../../components/Node';
import { NODE, RESIZE_GUTTER } from '../../constants/sizes';

export default observer(() => {
  checkCurrentUser();
  const {
    isTreeSectionMinimized: {
      openFiles: openFilesIsMinimized,
      files: filesIsMinimized
    },
    toggleTreeSection
  } = useUiStore();
  const [heights, setHeights] = useState([50, 50]);
  const [isDragging, setIsDragging] = useState(false);
  const nodes = getFolderFiles('alexkim205', 'WORKWITH', 'HEAD', '');

  useEffect(() => {
    // If only first tab is open, expand second
    if (!openFilesIsMinimized && filesIsMinimized) {
      setHeights([100, 0]);
    }
    // If only second tab is open, expand first
    else if (openFilesIsMinimized && !filesIsMinimized) {
      setHeights([0, 100]);
    }
    // If both closed, collapse both
    else if (openFilesIsMinimized && filesIsMinimized) {
      setHeights([0, 0]);
    }
    // If both open, set both to 50
    else if (!openFilesIsMinimized && !filesIsMinimized) {
      setHeights([50, 50]);
    }
  }, [openFilesIsMinimized, filesIsMinimized]);

  return (
    <Split
      direction="vertical"
      sizes={heights}
      style={{ height: '100%' }}
      minSize={NODE.HEIGHT}
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
        !openFilesIsMinimized && !filesIsMinimized ? RESIZE_GUTTER.HEIGHT : 0
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
      {/* Open Files (Tabs) Section */}
      <SectionContainer isDragging={isDragging}>
        <SectionNameContainer
          onClick={() => toggleTreeSection('openFiles')}
          zIndex={2}
        >
          <OpenCloseChevron open={!openFilesIsMinimized} />
          <SectionName>Tabbed Files</SectionName>
        </SectionNameContainer>
        <Scrollbars
          style={{
            width: '100%'
            // height: openFilesIsMinimized ? 0 : '100%'
          }}
          autoHideTimeout={500}
          autoHide
        >
          <SectionContent>
            {nodes &&
              nodes.map((n) => (
                <Node
                  owner="alexkim205"
                  repo="WORKWITH"
                  branch="HEAD"
                  data={n}
                  key={n.oid}
                />
              ))}
          </SectionContent>
        </Scrollbars>
      </SectionContainer>
      {/* Files Section */}

      <SectionContainer isDragging={isDragging}>
        <SectionNameContainer
          onClick={() => toggleTreeSection('files')}
          zIndex={1}
        >
          <OpenCloseChevron open={!filesIsMinimized} />
          <SectionName>Files</SectionName>
        </SectionNameContainer>
        <Scrollbars
          style={{
            width: '100%'
            // height: filesIsMinimized ? 0 : '100%'
          }}
          autoHideTimeout={500}
          autoHide
        >
          <SectionContent>
            {nodes &&
              nodes.map((n) => (
                <Node
                  owner="alexkim205"
                  repo="WORKWITH"
                  branch="HEAD"
                  data={n}
                  key={n.oid}
                />
              ))}
          </SectionContent>
        </Scrollbars>
      </SectionContainer>
    </Split>
  );
});
