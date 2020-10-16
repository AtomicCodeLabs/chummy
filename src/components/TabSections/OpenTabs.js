import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  getOpenRepositories,
  onUpdateOpenRepositories,
  repoMapToArray
} from '../../utils/repository';
import RepoNode from '../Node/RepoNode';
import { useFileStore } from '../../hooks/store';
import { toJS } from 'mobx';

const OpenTabsSection = observer(() => {
  const { openRepos, setOpenRepos, currentBranch } = useFileStore();

  // On Open repositories update setOpenRepos
  useEffect(() => {
    const removeListener = onUpdateOpenRepositories((repoMap) => {
      setOpenRepos(repoMapToArray(repoMap));
    });
    return removeListener;
  }, []);

  // Get all open repositories on startup
  useEffect(() => {
    if (openRepos.size === 0) {
      getOpenRepositories((repoMap) => {
        console.log('start, repoMap', repoMap);
        setOpenRepos(repoMapToArray(repoMap));
      });
    }
  }, [openRepos]);

  console.log('<RepoNode></RepoNode>', toJS(openRepos));

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
