import React from 'react';
import { observer } from 'mobx-react-lite';
import RepoNode from '../Node/RepoNode';
import { useFileStore } from '../../hooks/store';

const OpenTabsSection = observer(() => {
  const { openRepos, currentBranch } = useFileStore();

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
