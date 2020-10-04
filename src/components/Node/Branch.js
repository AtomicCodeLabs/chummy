import React from 'react';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import { GitBranchIcon } from '@primer/octicons-react';

import StyledNode from './Base.style';
import { changeActiveTab } from './util';

const Branch = observer(({ branch }) => {
  const handleClick = () => {
    // Redirect to file page
    changeActiveTab(branch.tabId);
  };

  return (
    <StyledNode.Container className="node" onClick={handleClick}>
      <StyledNode.Spacer level={1} />
      <StyledNode.Icon>
        <GitBranchIcon size={14} verticalAlign="middle" />
      </StyledNode.Icon>
      <StyledNode.Name>{branch.name}</StyledNode.Name>
    </StyledNode.Container>
  );
});

Branch.propTypes = {
  branch: PropTypes.shape({
    name: PropTypes.string.isRequired
  })
};

export default Branch;
