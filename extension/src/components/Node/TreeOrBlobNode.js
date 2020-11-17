import React from 'react';
import PropTypes from 'prop-types';

import File from './File';
// eslint-disable-next-line import/no-cycle
import Folder from './Folder';

const TreeOrBlobNode = ({ owner, repo, branch, data, level }) => {
  const isFile = data.type === 'blob';
  return (
    <>
      {isFile ? (
        <File
          owner={owner}
          repo={repo}
          branch={branch}
          data={data}
          level={level}
        />
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

TreeOrBlobNode.propTypes = {
  owner: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  branch: PropTypes.shape({
    name: PropTypes.string.isRequired,
    tabId: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['blob', 'tree']).isRequired
  }).isRequired,
  data: PropTypes.shape({
    oid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['blob', 'tree']).isRequired,
    path: PropTypes.string.isRequired
  }).isRequired,
  level: PropTypes.number
};

TreeOrBlobNode.defaultProps = {
  level: 0
};

export default TreeOrBlobNode;
