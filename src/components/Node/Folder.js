import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import getFolderFiles from '../../hooks/getFolderFiles';
// eslint-disable-next-line import/no-cycle
import Node from '.';

const Container = styled.div`
  padding-left: ${({ level }) => 30 * level}px;
`;

const Folder = ({ owner, repo, branch, data, level }) => {
  const nodes = getFolderFiles(owner, repo, branch, data.path);

  return (
    <Container level={level}>
      {data.name}
      {nodes &&
        nodes.map((node) => (
          <Node
            key={node.oid}
            owner={owner}
            repo={repo}
            branch={branch}
            data={node}
            level={level + 1}
          />
        ))}
    </Container>
  );
};

Folder.propTypes = {
  owner: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  branch: PropTypes.string.isRequired,
  data: PropTypes.shape({
    oid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['blob', 'tree']).isRequired,
    path: PropTypes.string.isRequired
  }).isRequired,
  level: PropTypes.number
};

Folder.defaultProps = {
  level: 0
};

export default Folder;
