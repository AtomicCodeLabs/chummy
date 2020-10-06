import React from 'react';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import { FileIcon } from '@primer/octicons-react';

import StyledNode from './Base.style';
import { changeActiveTab, parseFilePath } from './util';

const Branch = observer(({ branch, currentBranch }) => {
  const handleClick = () => {
    // Redirect to file page
    changeActiveTab(branch.tabId);
  };
  const { parentPath, fileName } = parseFilePath(branch.tabFilePath);

  return (
    <StyledNode.Container
      className="node"
      onClick={handleClick}
      isActive={
        currentBranch &&
        // repo.owner === currentBranch.repo.owner &&
        // repo.name === currentBranch.repo.name &&
        // branch.name === currentBranch.name &&
        branch.tabId === currentBranch.tabId
      }
    >
      <StyledNode.LeftSpacer level={1} />
      <StyledNode.Icon>
        <FileIcon size={14} verticalAlign="middle" />
      </StyledNode.Icon>
      <StyledNode.Name>{fileName}</StyledNode.Name>
      <StyledNode.SubName>
        {branch.name}/{parentPath}
      </StyledNode.SubName>
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
