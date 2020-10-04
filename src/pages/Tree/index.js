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
import Node from '../../components/Node/TreeOrBlobNode';
import { checkCurrentUser } from '../../hooks/firebase';
import { useUiStore, useFileStore } from '../../hooks/store';
import useOctoDAO from '../../hooks/octokit';
import { NODE, RESIZE_GUTTER } from '../../constants/sizes';
import { onActiveTabChange } from '../../utils/tabs';
import {
  getOpenRepositories,
  onUpdateOpenRepositories,
  transformOpenRepo
} from '../../utils/repository';
import RepoNode from '../../components/Node/RepoNode';

export default observer(() => {
  checkCurrentUser();
  const {
    isTreeSectionMinimized: {
      openFiles: openFilesIsMinimized,
      files: filesIsMinimized
    },
    toggleTreeSection
  } = useUiStore();
  const {
    openRepos,
    setOpenRepos,
    addOpenRepo,
    removeOpenRepo,
    currentBranch,
    setCurrentBranch,
    setCurrentWindowTab
  } = useFileStore();
  const octoDAO = useOctoDAO();
  const [heights, setHeights] = useState([20, 80]);
  const [isDragging, setIsDragging] = useState(false);
  const [nodes, setNodes] = useState([]);

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
      ({ owner, repo, branch, isGithubRepoUrl, windowId }) => {
        if (isGithubRepoUrl) {
          const newCurrentBranch = {
            name: branch.name,
            type: 'tree',
            tabId: branch.tabId,
            repo: { owner, name: repo, type: 'tree' }
          };
          setCurrentBranch(newCurrentBranch);
          setCurrentWindowTab(windowId, branch.tabId);
        } else {
          setCurrentBranch(null);
        }
      }
    );
    return removeListener;
  }, []);

  // On Open repositories update, add, remove, or update openRepos
  useEffect(() => {
    const removeListener = onUpdateOpenRepositories({
      create: ({ repo }) => addOpenRepo(transformOpenRepo(repo)),
      remove: ({ repo }) => removeOpenRepo(transformOpenRepo(repo))
    });
    return removeListener;
  }, []);

  // Get all open repositories on startup
  useEffect(() => {
    if (openRepos.size === 0) {
      getOpenRepositories((repoMap) => {
        const reposToSet = Object.values(repoMap)
          .flat()
          .map((r) => transformOpenRepo(r));
        setOpenRepos(reposToSet);
      });
    }
  }, [openRepos]);

  // Get current repository's files
  useEffect(() => {
    const getBranchNodes = async () => {
      if (!currentBranch) {
        // If null (on tab that's not github)
        return;
      }
      const responseNodes = await octoDAO.getRepositoryNodes(
        currentBranch.repo.owner,
        currentBranch.repo.name,
        currentBranch,
        ''
      );
      setNodes(responseNodes);
    };
    if (octoDAO) {
      getBranchNodes();
    }
  }, [octoDAO?.graphqlAuth, currentBranch]);

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
          <SectionName>Open Repositories</SectionName>
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
            {openRepos &&
              Array.from(openRepos).map(([, repo]) => (
                <RepoNode
                  key={`${repo.owner}/${repo.name}`}
                  repo={repo}
                  currentBranch={currentBranch}
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
            {currentBranch &&
              nodes &&
              nodes.map((n) => (
                <Node
                  owner={currentBranch.repo.owner}
                  repo={currentBranch.repo.name}
                  branch={currentBranch}
                  data={n}
                  key={n.path}
                />
              ))}
          </SectionContent>
        </Scrollbars>
      </SectionContainer>
    </Split>
  );
});
