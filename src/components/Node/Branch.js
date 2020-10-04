import React from 'react';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import { GitBranchIcon } from '@primer/octicons-react';

import StyledNode from './Base.style';
import { changeActiveTab } from './util';

const Branch = observer(({ repo, branch, currentBranch }) => {
  const handleClick = () => {
    // Redirect to file page
    changeActiveTab(branch.tabId);
  };

  return (
    <StyledNode.Container
      className="node"
      onClick={handleClick}
      isActive={
        currentBranch &&
        repo.owner === currentBranch.repo.owner &&
        repo.name === currentBranch.repo.name &&
        branch.name === currentBranch.name &&
        branch.tabId === currentBranch.tabId
      }
    >
      <StyledNode.Spacer level={1} />
      <StyledNode.Icon>
        <GitBranchIcon size={14} verticalAlign="middle" />
      </StyledNode.Icon>
      <StyledNode.Name>{branch.name}</StyledNode.Name>
    </StyledNode.Container>
  );
});

Branch.propTypes = {
  repo: PropTypes.shape({
    owner: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    branches: PropTypes.objectOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired
      })
    ),
    type: PropTypes.oneOf(['blob', 'tree']).isRequired
  }).isRequired,
  branch: PropTypes.shape({
    name: PropTypes.string.isRequired
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

Branch.defaultProps = {
  currentBranch: null
};

export default Branch;
