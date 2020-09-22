import React from 'react';
import PropTypes from 'prop-types';
import { FileIcon } from '@primer/octicons-react';

import StyledNode from './Base';

const File = ({ data, level }) => {
  return (
    <StyledNode.Container className="node">
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
