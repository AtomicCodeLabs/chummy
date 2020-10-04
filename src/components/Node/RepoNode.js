import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { RepoIcon } from '@primer/octicons-react';

import StyledNode from './Base.style';
import OpenCloseChevron from '../OpenCloseChevron';
import Branch from './Branch';

const RepoNode = ({ repo }) => {
  const [open, setOpen] = useState(false);
  const hasBranches = !!Object.keys(repo.branches).length;

  return (
    <>
      <StyledNode.Container className="node" onClick={() => setOpen(!open)}>
        <StyledNode.Spacer level={0} />
        <OpenCloseChevron open={open} />
        <StyledNode.Icon>
          <RepoIcon size={14} verticalAlign="middle" />
        </StyledNode.Icon>
        <StyledNode.Name>
          {repo.owner}/{repo.name}
        </StyledNode.Name>
      </StyledNode.Container>
      <>
        {open &&
          hasBranches &&
          Object.values(repo.branches).map((branch, i) => (
            <Branch key={i} branch={branch} />
          ))}
      </>
    </>
  );
};

RepoNode.propTypes = {
  repo: PropTypes.shape({
    owner: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    branches: PropTypes.objectOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired
      })
    ),
    type: PropTypes.oneOf(['blob', 'tree']).isRequired
  }).isRequired
};

export default RepoNode;
