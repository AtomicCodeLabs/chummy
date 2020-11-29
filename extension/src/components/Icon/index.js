/* eslint-disable react/prop-types */
import React from 'react';
import { CircleIcon } from '@primer/octicons-react';

import IconWithSubIcon from './IconWithSubIcon';
import { FlagIcon } from './Icons';
import useTheme from '../../hooks/useTheme';
import { flagIconColor } from '../../constants/theme';

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

export const IconWithBadge = ({ Icon, subtext }) => (
  <IconWithSubIcon Icon={Icon} SubIcon={<CircleIcon />} subtext={subtext} />
);
