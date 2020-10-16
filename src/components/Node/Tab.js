import React from 'react';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import { FileIcon } from '@primer/octicons-react';

import StyledNode from './Base.style';
import { changeActiveTab, processTabInformation } from './util';

const Tab = observer(({ tab, currentBranch }) => {
  const handleClick = () => {
    // Redirect to file page
    changeActiveTab(tab.tabId);
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
      <StyledNode.LeftSpacer level={1} />
      <StyledNode.Icon>
        <FileIcon size={14} verticalAlign="middle" />
      </StyledNode.Icon>
      <StyledNode.Name>{primaryText}</StyledNode.Name>
      <StyledNode.SubName>
        <span className="subpage">{subpageText}</span>/{secondaryText}
      </StyledNode.SubName>
    </StyledNode.Container>
  );
});

Tab.propTypes = {
  repo: PropTypes.shape({
    owner: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    tabs: PropTypes.objectOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired
      })
    ),
    type: PropTypes.oneOf(['blob', 'tree']).isRequired
  }).isRequired,
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
