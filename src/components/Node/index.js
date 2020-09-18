import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import File from './File';
// eslint-disable-next-line import/no-cycle
import Folder from './Folder';

const Container = styled.div``;

const Node = ({ owner, repo, branch, data, level, order }) => {
  const isFile = data.type === 'blob';
  console.log(order);
  return (
    <Container>
      {isFile ? (
        <File data={data} level={level} order={order} />
      ) : (
        <Folder
          owner={owner}
          repo={repo}
          branch={branch}
          data={data}
          level={level}
          order={order}
        />
      )}
    </Container>
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
  order: PropTypes.number,
  level: PropTypes.number
};

Node.defaultProps = {
  order: 0,
  level: 0
};

export default Node;
