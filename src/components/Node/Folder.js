import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import getFolderFiles from '../../hooks/getFolderFiles';
// eslint-disable-next-line import/no-cycle
import Node from '.';

const FolderContainer = styled.div`
  padding-left: ${({ level }) => 30 * level}px;
  /* margin-left: ${({ level }) => -30 * level}px; */
`;
const FolderContentContainer = styled.div`
  /* padding-left: ${({ level }) => 30 * level}px; */
  /* margin-left: ${({ level }) => -30 * level}px; */
`;

const Folder = ({ owner, repo, branch, data, level, order }) => {
  const nodes = getFolderFiles(owner, repo, branch, data.path);
  console.log(order);

  return (
    <>
      <FolderContainer className="node" level={level}>
        {data.name}
      </FolderContainer>
      <FolderContentContainer level={level}>
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
      </FolderContentContainer>
    </>
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
  order: PropTypes.number.isRequired,
  level: PropTypes.number
};

Folder.defaultProps = {
  level: 0
};

export default Folder;
