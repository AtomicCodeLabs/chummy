import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  padding-left: ${({ level }) => 15 * level}px;
`;

const File = ({ data, level }) => {
  return <Container level={level}>{data.name}</Container>;
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
