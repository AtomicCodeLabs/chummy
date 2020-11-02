import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { RepoIcon } from '@primer/octicons-react';

import StyledNode from './Base.style';
import Tab from './Tab';
import OpenCloseChevron from '../OpenCloseChevron';
import { useFileStore } from '../../hooks/store';
import useTheme from '../../hooks/useTheme';
import { ICON } from '../../constants/sizes';

const RepoNode = ({ repo, currentBranch }) => {
  const { spacing } = useTheme();
  const { openOpenRepo, closeOpenRepo, getOpenRepo } = useFileStore();
  const [open, setOpen] = useState(false);
  const hasTabs = !!Object.keys(repo.tabs).length;

  useEffect(() => {
    setOpen(getOpenRepo(repo.owner, repo.name)?.isOpen || false);
  }, [getOpenRepo(repo.owner, repo.name)]);

  const handleClick = () => {
    if (open) {
      closeOpenRepo(repo.owner, repo.name);
      setOpen(false);
    } else {
      openOpenRepo(repo.owner, repo.name);
      setOpen(true);
    }
  };

  return (
    <>
      <StyledNode.Container className="node" onClick={handleClick}>
        <StyledNode.LeftSpacer level={0} />
        <OpenCloseChevron open={open} />
        <StyledNode.Icon>
          <RepoIcon
            size={ICON.SIZE({ theme: { spacing } })}
            verticalAlign="middle"
          />
        </StyledNode.Icon>
        <StyledNode.Name>
          {repo.owner}/{repo.name}
        </StyledNode.Name>
      </StyledNode.Container>
      <>
        {open &&
          hasTabs &&
          Object.values(repo.tabs).map((tab) => (
            <Tab
              key={`${tab.name}#${tab.tabId}`}
              repo={repo}
              tab={tab}
              currentBranch={currentBranch}
            />
          ))}
      </>
    </>
  );
};

RepoNode.propTypes = {
  repo: PropTypes.shape({
    owner: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    tabs: PropTypes.objectOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired
      })
    ),
    type: PropTypes.oneOf(['blob', 'tree']).isRequired
  }).isRequired,
  currentBranch: PropTypes.shape({
    name: PropTypes.string,
    repo: PropTypes.shape({
      owner: PropTypes.string,
      name: PropTypes.string,
      type: PropTypes.oneOf(['blob', 'tree'])
    })
  })
};

RepoNode.defaultProps = {
  currentBranch: null
};

export default RepoNode;
