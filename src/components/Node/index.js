import React from 'react';
import PropTypes from 'prop-types';

import File from './File';
// eslint-disable-next-line import/no-cycle
import Folder from './Folder';

const Node = ({ owner, repo, branch, data, level }) => {
  const isFile = data.type === 'blob';
  return (
    <>
      {isFile ? (
        <File data={data} level={level} />
      ) : (
        <Folder
          owner={owner}
          repo={repo}
          branch={branch}
          data={data}
          level={level}
        />
      )}
    </>
  );
};

Node.propTypes = {
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

Node.defaultProps = {
  level: 0
};

export default Node;
