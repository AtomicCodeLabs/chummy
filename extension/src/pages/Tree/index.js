import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import {
  SectionContainer,
  SectionNameContainer,
  SectionName,
  SectionContent
} from '../../components/Section';
import SplitSections from '../../components/Section/SplitSections';
import OpenCloseChevron from '../../components/OpenCloseChevron';
import Scrollbars from '../../components/Scrollbars';
import OpenTabsSection from './OpenTabs';
import FilesSection from './Files';
import { checkCurrentUser } from '../../hooks/dao';
import { useUiStore, useFileStore } from '../../hooks/store';
import useTheme from '../../hooks/useTheme';
import { onActiveTabChange } from '../../utils/tabs';
import { areArraysEqual } from '../../utils';
import { NODE } from '../../constants/sizes';

export default observer(() => {
  checkCurrentUser();
  const {
    // eslint-disable-next-line no-unused-vars
    isTreeSectionMinimized: { sessions, openTabs, files },
    toggleTreeSection,
    setTreeSectionHeight
  } = useUiStore();
  const { setCurrentBranch, setCurrentWindowTab } = useFileStore();
  const { spacing } = useTheme();
  const sections = [openTabs, files]; // const sections = [sessions, openTabs, files];
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
        // Ignore if not github repo url
        if (!isGithubRepoUrl) {
          return;
        }
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
      }
    );
    return removeListener;
  }, []);

  return (
    <SplitSections heights={heights} minimized={minimized}>
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
          <Scrollbars
            height={`calc(100% - ${NODE.HEIGHT({ theme: { spacing } })}px)`}
          >
            <SectionContent>
              <OpenTabsSection />
            </SectionContent>
          </Scrollbars>
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
          <Scrollbars
            height={`calc(100% - ${NODE.HEIGHT({ theme: { spacing } })}px)`}
          >
            <SectionContent>
              <FilesSection />
            </SectionContent>
          </Scrollbars>
        </SectionContainer>
      </div>
    </SplitSections>
  );
});
