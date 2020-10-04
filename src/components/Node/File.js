import React, { useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import { FileIcon, LinkExternalIcon } from '@primer/octicons-react';

import StyledNode from './Base.style';
import { useFileStore } from '../../hooks/store';
import { redirectTo } from './util';

const File = observer(({ owner, repo, branch, data, level }) => {
  const [showNewTab, setShowNewTab] = useState(false);
  const newTabEl = useRef(null);
  const { currentWindowTab } = useFileStore();

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    let openInNewTab = false;
    if (e.target === newTabEl.current || newTabEl.current.contains(e.target)) {
      openInNewTab = true;
    }

    // If openInNewTab is true -> Redirect to file by creating new tab
    // If openInNewTab is false -> Node was clicked, so redirect in same tab
    redirectTo(
      `/${owner}/${repo}`,
      `/blob/${branch.name}/${data.path}`,
      currentWindowTab,
      openInNewTab
    );
  };

  return (
    <StyledNode.Container
      className="node"
      onClickCapture={handleClick}
      onMouseEnter={() => setShowNewTab(true)}
      onMouseLeave={() => setShowNewTab(false)}
    >
      <StyledNode.LeftSpacer level={level} />
      <StyledNode.Icon>
        <FileIcon size={14} verticalAlign="middle" />
      </StyledNode.Icon>
      <StyledNode.Name>{data.name}</StyledNode.Name>
      {showNewTab && (
        <>
          <StyledNode.MiddleSpacer />
          <StyledNode.Icon marginRight="1.5rem" ref={newTabEl}>
            <LinkExternalIcon size={14} verticalAlign="middle" />
          </StyledNode.Icon>
        </>
      )}
    </StyledNode.Container>
  );
});

File.propTypes = {
  owner: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  branch: PropTypes.shape({
    name: PropTypes.string.isRequired,
    tabId: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['blob', 'tree']).isRequired
  }).isRequired,
  data: PropTypes.shape({
    oid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['blob', 'tree']).isRequired,
    path: PropTypes.string.isRequired
  }).isRequired,
  level: PropTypes.number
};

File.defaultProps = {
  level: 0
};

export default File;
