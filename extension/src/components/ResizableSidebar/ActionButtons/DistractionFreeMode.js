import React from 'react';
import { EyeIcon, EyeClosedIcon } from '@primer/octicons-react';
import { observer } from 'mobx-react-lite';

import { Icon } from '../../Node/Base.style';
import { useUiStore, useUserStore } from '../../../hooks/store';
import useTheme from '../../../hooks/useTheme';
import { ICON } from '../../../constants/sizes';
import { toggleDistractionFreeMode } from './util';

const DistractionFree = observer(() => {
  const { user } = useUserStore();
  const { isDistractionFreeMode, setIsDistractionFreeMode } = useUiStore();
  const { spacing } = useTheme();

  const onClick = () => {
    toggleDistractionFreeMode(!isDistractionFreeMode);
    setIsDistractionFreeMode(!isDistractionFreeMode);
  };

  const isDisabled = !['professional', 'enterprise'].includes(
    user?.accountType
  );

  return (
    <Icon
      title={
        isDisabled
          ? 'Distraction free mode is a professional edition feature'
          : 'Toggle distraction free mode'
      }
      onClick={isDisabled ? null : onClick}
      disabled={isDisabled}
      hoverable
    >
      {!isDisabled && isDistractionFreeMode ? (
        <EyeClosedIcon
          verticalAlign="middle"
          size={ICON.SIZE({ theme: { spacing } })}
        />
      ) : (
        <EyeIcon
          verticalAlign="middle"
          size={ICON.SIZE({ theme: { spacing } })}
        />
      )}
    </Icon>
  );
});

export default DistractionFree;
