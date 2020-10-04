import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FileDirectoryIcon } from '@primer/octicons-react';

import getFolderFiles from '../../hooks/getFolderFiles';
// eslint-disable-next-line import/no-cycle
import Node from './TreeOrBlobNode';
import StyledNode from './Base.style';
import OpenCloseChevron from '../OpenCloseChevron';
import { folderIconColor } from '../../constants/theme';

const Folder = ({ owner, repo, branch, data, level }) => {
  const [open, setOpen] = useState(false);
  const nodes = getFolderFiles(
    { owner, repo, branch, treePath: data.path },
    open
  );

  return (
    <>
      <StyledNode.Container className="node" onClick={() => setOpen(!open)}>
        <StyledNode.Spacer level={level} />
        <OpenCloseChevron open={open} />
        <StyledNode.Icon iconFill={folderIconColor}>
          <FileDirectoryIcon size={14} verticalAlign="middle" />
        </StyledNode.Icon>
        <StyledNode.Name>{data.name}</StyledNode.Name>
      </StyledNode.Container>
      <>
        {open &&
          nodes &&
          nodes.map((node, i) => (
            <Node
              key={i}
              owner={owner}
              repo={repo}
              branch={branch}
              data={node}
              level={level + 1}
            />
          ))}
      </>
    </>
  );
};

Folder.propTypes = {
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

Folder.defaultProps = {
  level: 0
};

export default Folder;
