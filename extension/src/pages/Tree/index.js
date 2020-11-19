import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Scrollbars } from 'react-custom-scrollbars';

import {
  SectionNameContainer,
  SectionName,
  SectionContent
} from '../../components/Section';
import SplitSections from '../../components/Section/SplitSections';
import OpenCloseChevron from '../../components/OpenCloseChevron';
import OpenTabsSection from '../../components/TreeSections/OpenTabs';
import FilesSection from '../../components/TreeSections/Files';
import { checkCurrentUser } from '../../hooks/firebase';
import { useUiStore, useFileStore } from '../../hooks/store';
import { onActiveTabChange } from '../../utils/tabs';

export default observer(() => {
  checkCurrentUser();
  const {
    isTreeSectionMinimized: { openTabs, files },
    toggleTreeSection,
    setTreeSectionHeight
  } = useUiStore();
  const { setCurrentBranch, setCurrentWindowTab } = useFileStore();
  const [heights, setHeights] = useState([
    openTabs.lastHeight,
    files.lastHeight
  ]);

  // Change heights when heights are updated from storage sync
  useEffect(() => {
    if (heights[0] === openTabs.lastHeight && heights[1] === files.lastHeight) {
      return;
    }
    setHeights([openTabs.lastHeight, files.lastHeight]);
  }, [openTabs.lastHeight, files.lastHeight]);

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
          setCurrentBranch(newCurrentBranch);
        } else {
          setCurrentBranch(null);
        }
      }
    );
    return removeListener;
  }, []);

  return (
    <SplitSections.Container
      heights={heights}
      setHeights={(sizes) => {
        setHeights(sizes);
        setTreeSectionHeight('openTabs', sizes[0]);
        setTreeSectionHeight('files', sizes[1]);
      }}
      isMinimizedArray={[openTabs.isMinimized, files.isMinimized]}
    >
      <>
        <SectionNameContainer
          onClick={() => toggleTreeSection('openTabs')}
          zIndex={2}
        >
          <OpenCloseChevron open={!openTabs.isMinimized} />
          <SectionName>Open Tabs</SectionName>
        </SectionNameContainer>
        <Scrollbars
          style={{
            width: '100%'
          }}
          autoHideTimeout={500}
          autoHide
        >
          <SectionContent>
            <OpenTabsSection />
          </SectionContent>
        </Scrollbars>
      </>
      <>
        <SectionNameContainer
          onClick={() => toggleTreeSection('files')}
          zIndex={1}
        >
          <OpenCloseChevron open={!files.isMinimized} />
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
      </>
    </SplitSections.Container>
  );
});
