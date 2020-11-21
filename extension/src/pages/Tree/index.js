import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import {
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

  // Change heights when heights are updated from storage sync
  useEffect(
    () => {
      const nextHeights = sections.map((s) => s.lastHeight);
      if (
        heights.length === nextHeights.length &&
        heights.every((h, i) => h === nextHeights[i])
      ) {
        return;
      }
      setHeights(nextHeights);
    },
    sections.map((s) => s.lastHeight)
  );

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
      setHeights={setHeights}
      isMinimizedArray={sections.map((s) => s.isMinimized)}
    >
      <div onResizeStop={(height) => setTreeSectionHeight('sessions', height)}>
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
      </div>
      <div onResizeStop={(height) => setTreeSectionHeight('openTabs', height)}>
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
      </div>
      <div onResizeStop={(height) => setTreeSectionHeight('files', height)}>
        <SectionNameContainer
          onClick={() => toggleTreeSection('files')}
          zIndex={1}
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
      </div>
    </SplitSections.Container>
  );
});
