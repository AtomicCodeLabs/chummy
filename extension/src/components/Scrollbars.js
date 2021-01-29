import React from 'react';
import { Scrollbars } from 'rc-scrollbars';

// Wrapper for Scrollbars
// eslint-disable-next-line react/prop-types
export default ({ height, children, ...props }) => {
  return (
    <Scrollbars
      style={{
        width: '100%',
        height: height || '100%'
      }}
      autoHideTimeout={500}
      autoHide={false}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {children}
    </Scrollbars>
  );
};
