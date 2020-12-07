/* eslint-disable react/prop-types */
/* eslint-disable import/prefer-default-export */
/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';

import { BookmarkFillIcon } from '@primer/octicons-react';

const RotatedBookmark = styled(BookmarkFillIcon)`
  transform: rotate(-90deg) scaleY(0.7);

  ${({ color }) =>
    color &&
    css`
      fill: ${color};
    `}
`;

export const FlagIcon = forwardRef(({ color, ...props }, ref) => {
  return <RotatedBookmark ref={ref} color={color} {...props} />;
});
