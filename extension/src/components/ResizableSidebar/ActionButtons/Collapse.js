import React from 'react';
import { FoldIcon } from '@primer/octicons-react';
import { observer } from 'mobx-react-lite';

import { Icon } from '../../Node/Base.style';
import { useFileStore } from '../../../hooks/store';
import useTheme from '../../../hooks/useTheme';
import { ICON } from '../../../constants/sizes';

const Collapse = observer(() => {
  const { closeAllNodesBelow, currentBranch } = useFileStore();
  const { spacing } = useTheme();

  const collapseFiles = () => {
    if (!currentBranch) return;
    closeAllNodesBelow(
      currentBranch?.repo?.owner,
      currentBranch?.repo?.name,
      currentBranch,
      ''
    );
  };

  return (
    <Icon
      title="Collapse folders in explorer"
      onClick={collapseFiles}
      hoverable
    >
      <FoldIcon
        verticalAlign="middle"
        size={ICON.SIZE({ theme: { spacing } })}
      />
    </Icon>
  );
});

export default Collapse;
