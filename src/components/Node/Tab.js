import React from 'react';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import { FileIcon } from '@primer/octicons-react';

import StyledNode from './Base.style';
import { changeActiveTab, processTabInformation } from './util';
import { useUiStore } from '../../hooks/store';
import useTheme from '../../hooks/useTheme';
import { ICON } from '../../constants/sizes';

const Tab = observer(({ tab, currentBranch }) => {
  const { spacing } = useTheme();
  const { setPending } = useUiStore();
  const handleClick = async () => {
    // Redirect to file page
    setPending('Explorer');
    await changeActiveTab(tab.tabId);
    setPending('None');
  };
  const { primaryText, secondaryText, subpageText } = processTabInformation(
    tab
  );

  return (
    <StyledNode.Container
      className="node"
      onClick={handleClick}
      isActive={currentBranch && tab.tabId === currentBranch.tabId}
    >
      <StyledNode.LeftSpacer level={1} extraIconFiller />
      <StyledNode.Icon>
        <FileIcon
          size={ICON.SIZE({ theme: { spacing } })}
          verticalAlign="middle"
        />
      </StyledNode.Icon>
      <StyledNode.Name>{primaryText}</StyledNode.Name>
      <StyledNode.SubName variant="smallFont">
        <span className="subpage">{subpageText}</span>
        <span>/{secondaryText}</span>
      </StyledNode.SubName>
    </StyledNode.Container>
  );
});

Tab.propTypes = {
  tab: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  currentBranch: PropTypes.shape({
    name: PropTypes.string,
    repo: PropTypes.shape({
      owner: PropTypes.string,
      name: PropTypes.string,
      type: PropTypes.oneOf(['blob', 'tree'])
    })
  })
};

Tab.defaultProps = {
  currentBranch: null
};

export default Tab;
