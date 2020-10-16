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
import OpenTabsSection from '../../components/TabSections/OpenTabs';
import { checkCurrentUser } from '../../hooks/firebase';
import { useUiStore, useFileStore } from '../../hooks/store';
import { NODE, RESIZE_GUTTER } from '../../constants/sizes';
import { onActiveTabChange } from '../../utils/tabs';
import FilesSection from '../../components/TabSections/Files';

export default observer(() => {
  checkCurrentUser();
  const {
    isTreeSectionMinimized: {
      openFiles: openFilesIsMinimized,
      files: filesIsMinimized
    },
    toggleTreeSection
  } = useUiStore();
  const { setCurrentBranch, setCurrentWindowTab } = useFileStore();
  const [heights, setHeights] = useState([20, 80]);
  const [isDragging, setIsDragging] = useState(false);

  // Resize sidebar sections logic
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
    // If both open, set first to 20 and second to 80
    else if (!openFilesIsMinimized && !filesIsMinimized) {
      setHeights([20, 80]);
    }
  }, [openFilesIsMinimized, filesIsMinimized]);

  // On Tab Change listener set currentBranch
  useEffect(() => {
    const removeListener = onActiveTabChange(
      ({ owner, repo, tab, isGithubRepoUrl, windowId }) => {
        if (isGithubRepoUrl) {
          setCurrentWindowTab(windowId, tab.tabId);
          // Only set current branch if tab update is repo subpage
          const newCurrentBranch = {
            repo: { owner, name: repo, type: 'tree' },
            name: tab.name,
            type: 'tree',
            tabId: tab.tabId,
            nodeName: tab.nodeName
          };
          console.log('seetcurrentbranch', newCurrentBranch, owner, repo, tab);
          setCurrentBranch(newCurrentBranch);
        } else {
          setCurrentBranch(null);
        }
      }
    );
    return removeListener;
  }, []);

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
          onClick={() => toggleTreeSection('openTabs')}
          zIndex={2}
        >
          <OpenCloseChevron open={!openFilesIsMinimized} />
          <SectionName>Open Tabs</SectionName>
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
            <OpenTabsSection />
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
            <FilesSection />
          </SectionContent>
        </Scrollbars>
      </SectionContainer>
    </Split>
  );
});
