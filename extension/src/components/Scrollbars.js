import React from 'react';
import styled from 'styled-components';

const Scrollbars = styled.div`
  width: 100%;
  height: ${({ height }) => height || '100%'};
  overflow: scroll;
  scrollbar-width: thin;
`;

// Wrapper for Scrollbars
// eslint-disable-next-line react/prop-types
export default ({ height, children, ...props }) => {
  return (
    <Scrollbars
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {children}
    </Scrollbars>
  );
};
