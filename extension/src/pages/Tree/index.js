import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import {
  SectionContainer,
  SectionNameContainer,
  SectionName,
  SectionContent,
  ScrollContainer
} from '../../components/Section';
import SplitSections from '../../components/Section/SplitSections';
import OpenCloseChevron from '../../components/OpenCloseChevron';
import OpenTabsSection from '../../components/TreeSections/OpenTabs';
import FilesSection from '../../components/TreeSections/Files';
import { checkCurrentUser } from '../../hooks/firebase';
import { useUiStore, useFileStore } from '../../hooks/store';
import { onActiveTabChange } from '../../utils/tabs';
import { areArraysEqual } from '../../utils';

export default observer(() => {
  checkCurrentUser();
  const {
    isTreeSectionMinimized: { sessions, openTabs, files },
    toggleTreeSection,
    setTreeSectionHeight
  } = useUiStore();
  const { setCurrentBranch, setCurrentWindowTab } = useFileStore();
  const sections = [sessions, openTabs, files];
  const [heights, setHeights] = useState(sections.map((s) => s.lastHeight));
  const [minimized, setMinimized] = useState(
    sections.map((s) => s.isMinimized)
  );

  // Change heights and minimized when either is updated from
  // storage sync
  useEffect(() => {
    const nextHeights = sections.map((s) => s.lastHeight);
    if (!areArraysEqual(heights, nextHeights)) {
      setHeights(nextHeights);
    }

    const nextMinimized = sections.map((s) => s.isMinimized);
    if (!areArraysEqual(minimized, nextMinimized)) {
      setMinimized(nextMinimized);
    }
  }, [
    ...sections.map((s) => s.lastHeight),
    ...sections.map((s) => s.isMinimized)
  ]);

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
    <SplitSections
      heights={heights}
      minimized={minimized}
    >
      <div onResizeStop={(height) => setTreeSectionHeight('sessions', height)}>
        <SectionContainer>
          <SectionNameContainer
            onClick={() => toggleTreeSection('sessions')}
            zIndex={2}
            hasShadow={!sessions.isMinimized}
          >
            <OpenCloseChevron open={!sessions.isMinimized} />
            <SectionName>Sessions</SectionName>
          </SectionNameContainer>
          <ScrollContainer>
            <SectionContent>{/* <OpenTabsSection /> */}</SectionContent>
          </ScrollContainer>
        </SectionContainer>
      </div>
      <div onResizeStop={(height) => setTreeSectionHeight('openTabs', height)}>
        <SectionContainer>
          <SectionNameContainer
            onClick={() => toggleTreeSection('openTabs')}
            zIndex={2}
            hasShadow={!openTabs.isMinimized}
          >
            <OpenCloseChevron open={!openTabs.isMinimized} />
            <SectionName>Open Tabs</SectionName>
          </SectionNameContainer>
          <ScrollContainer>
            <SectionContent>
              <OpenTabsSection />
            </SectionContent>
          </ScrollContainer>
        </SectionContainer>
      </div>
      <div onResizeStop={(height) => setTreeSectionHeight('files', height)}>
        <SectionContainer>
          <SectionNameContainer
            onClick={() => {
              toggleTreeSection('files');
              // when last section is closed, set second to last to fill up remaining height
            }}
            zIndex={2}
            hasShadow={!files.isMinimized}
          >
            <OpenCloseChevron open={!files.isMinimized} />
            <SectionName>Files</SectionName>
          </SectionNameContainer>
          <ScrollContainer>
            <SectionContent>
              <FilesSection />
            </SectionContent>
          </ScrollContainer>
        </SectionContainer>
      </div>
    </SplitSections>
  );
});
