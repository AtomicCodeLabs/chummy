import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import { FileIcon, XIcon } from '@primer/octicons-react';

import StyledNode from './Base.style';
import {
  changeActiveTab,
  clickedEl,
  closeTab,
  processTabInformation
} from './util';
import { useUiStore } from '../../hooks/store';
import useTheme from '../../hooks/useTheme';
import { ICON } from '../../constants/sizes';

const Tab = observer(({ tab, currentBranch }) => {
  const { spacing } = useTheme();
  const [showX, setShowX] = useState(false);
  const xEl = useRef(null);
  const { addPendingRequest, removePendingRequest } = useUiStore();
  const handleClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    // X Icon
    if (clickedEl(xEl, e)) {
      closeTab(tab.tabId);
      return;
    }

    // Change active tab
    addPendingRequest('Explorer');
    await changeActiveTab(tab.tabId);
    removePendingRequest('Explorer');
  };
  const { primaryText, secondaryText, subpageText } = processTabInformation(
    tab
  );

  return (
    <StyledNode.Container
      className="node"
      onClickCapture={handleClick}
      isActive={currentBranch && tab.tabId === currentBranch.tabId}
      onMouseEnter={() => setShowX(true)}
      onMouseLeave={() => setShowX(false)}
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
      <StyledNode.MiddleSpacer />
      <StyledNode.RightIconContainer>
        {showX && (
          <StyledNode.Icon ref={xEl}>
            <XIcon
              size={ICON.SIZE({ theme: { spacing } })}
              verticalAlign="middle"
            />
          </StyledNode.Icon>
        )}
      </StyledNode.RightIconContainer>
    </StyledNode.Container>
  );
});

Tab.propTypes = {
  tab: PropTypes.shape({
    name: PropTypes.string,
    tabId: PropTypes.number,
    nodeName: PropTypes.string,
    subpage: PropTypes.string
  }).isRequired,
  currentBranch: PropTypes.shape({
    name: PropTypes.string,
    repo: PropTypes.shape({
      owner: PropTypes.string,
      name: PropTypes.string,
      type: PropTypes.oneOf(['blob', 'tree']),
      defaultBranch: PropTypes.string
    })
  })
};

Tab.defaultProps = {
  currentBranch: null
};

export default Tab;
