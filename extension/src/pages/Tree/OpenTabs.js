import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';

import { A } from '../../components/Text';
import RepoNode from '../../components/Node/RepoNode';
import { redirectToUrl, openSession } from '../../utils/browser';
import { useFileStore } from '../../hooks/store';
import {
  h3FontSize,
  h2MarginSize,
  subTitleMarginSize,
  lighterTextColor
} from '../../constants/theme';
import { GITHUB_URLS } from '../../global/constants';

const HelpContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: ${h2MarginSize};

  font-size: ${h3FontSize};
  color: ${lighterTextColor};
  font-weight: 300;
  text-align: center;

  .section:not(:last-child) {
    margin-bottom: ${subTitleMarginSize};
  }
`;

const OpenTabsSection = observer(() => {
  const { openRepos, currentBranch, currentSession } = useFileStore();

  const handleGetStartedClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    redirectToUrl(GITHUB_URLS.MAIN_REPO);
  };
  const handleRestoreClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    openSession(currentSession);
  };

  if (!openRepos || openRepos.size === 0) {
    return (
      <HelpContainer>
        <div className="section">It&apos;s quiet here...</div>
        <div className="section">
          Open <A onClick={handleGetStartedClick}>any</A> Github repository to
          get started.
        </div>
        <div className="section">
          Restore your <A onClick={handleRestoreClick}>last session</A>.
        </div>
      </HelpContainer>
    );
  }

  return (
    <>
      {openRepos &&
        Array.from(openRepos).map(([, repo]) => (
          <RepoNode
            key={`${repo.owner}/${repo.name}`}
            repo={repo}
            currentBranch={currentBranch}
          />
        ))}
    </>
  );
});

export default OpenTabsSection;
