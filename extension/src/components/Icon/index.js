/* eslint-disable react/prop-types */
import React from 'react';

import IconWithSubIcon from './IconWithSubIcon';
import { FlagIcon } from './Icons';
import useTheme from '../../hooks/useTheme';
import { flagIconColor } from '../../constants/theme';

// eslint-disable-next-line import/prefer-default-export
export const IconWithFeatureFlag = ({ Icon, active = false }) => {
  const { theme: mode } = useTheme();
  const subIconSize = Math.round((Icon.props.size * 5) / 7);
  return (
    <IconWithSubIcon
      Icon={Icon}
      SubIcon={
        <FlagIcon
          color={flagIconColor({ theme: { theme: mode } })}
          size={subIconSize}
          active={active}
        />
      }
      offsetY={10}
      offsetX={5}
    />
  );
};
