import React from 'react';
import PropTypes from 'prop-types';
import { FileIcon } from '@primer/octicons-react';

import StyledNode from './Base.style';
import { redirectTo } from './util';
import getCurrentTabRepositoryInfo from '../../hooks/getCurrentTabRepositoryInfo';

const File = ({ data, level }) => {
  const handleClick = () => {
    getCurrentTabRepositoryInfo((currentRepoInfo) => {
      if (currentRepoInfo) {
        const { user, repository, branch, url } = currentRepoInfo;
        console.log(
          'handling file click',
          `${user}/${repository}/blob/${branch}/${data.path}`,
          url
        );
        // Redirect to file page
        redirectTo(`${user}/${repository}/blob/${branch}/${data.path}`);
      }
    });
  };

  return (
    <StyledNode.Container className="node" onClick={handleClick}>
      <StyledNode.Spacer level={level} />
      <StyledNode.Icon>
        <FileIcon size={14} verticalAlign="middle" />
      </StyledNode.Icon>
      <StyledNode.Name>{data.name}</StyledNode.Name>
    </StyledNode.Container>
  );
};

File.propTypes = {
  data: PropTypes.shape({
    oid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['blob', 'tree']).isRequired,
    path: PropTypes.string.isRequired
  }).isRequired,
  level: PropTypes.number
};

File.defaultProps = {
  level: 0
};

export default File;
