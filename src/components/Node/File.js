import React from 'react';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import { FileIcon } from '@primer/octicons-react';

import StyledNode from './Base.style';
import { useFileStore } from '../../hooks/store';
import { redirectTo } from './util';

const File = observer(({ owner, repo, branch, data, level }) => {
  const { currentWindowTab } = useFileStore();

  const handleClick = () => {
    // Redirect to file page
    redirectTo(
      `/${owner}/${repo}`,
      `/blob/${branch.name}/${data.path}`,
      currentWindowTab
    );
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
});

File.propTypes = {
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

File.defaultProps = {
  level: 0
};

export default File;
