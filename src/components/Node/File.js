import React, { useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import {
  FileIcon,
  LinkExternalIcon,
  BookmarkIcon,
  BookmarkFillIcon
} from '@primer/octicons-react';

import StyledNode from './Base.style';
import { useFileStore } from '../../hooks/store';
import useTheme from '../../hooks/useTheme';
import { redirectTo, clickedEl, createBookmark } from './util';
import { ICON } from '../../constants/sizes';
import useBookmarkState from '../../hooks/useBookmarkState';
import { bookmarkIconColor } from '../../constants/theme';

const File = observer(({ owner, repo, branch, data, level }) => {
  const bookmark = createBookmark(owner, repo, branch.name, data);
  const [showNewTab, setShowNewTab] = useState(false);
  const bookmarkEl = useRef(null);
  const newTabEl = useRef(null);
  const { spacing } = useTheme();
  const { currentWindowTab } = useFileStore();
  const [localBookmarked, setLocalBookmarked] = useBookmarkState(
    bookmark,
    'Explorer'
  );

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    // Bookmark file
    if (clickedEl(bookmarkEl, e)) {
      setLocalBookmarked(!localBookmarked); // toggle local bookmarked
      return;
    }

    // OR Redirect (new tab or not)
    let openInNewTab = false;
    if (clickedEl(newTabEl, e)) {
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
      <StyledNode.LeftSpacer level={level} extraIconFiller />
      <StyledNode.Icon>
        <FileIcon
          size={ICON.SIZE({ theme: { spacing } }) - 1}
          verticalAlign="middle"
        />
      </StyledNode.Icon>
      <StyledNode.Name>{data.name}</StyledNode.Name>
      <StyledNode.MiddleSpacer />
      <StyledNode.RightIconContainer>
        {showNewTab && (
          <StyledNode.Icon ref={newTabEl}>
            <LinkExternalIcon
              size={ICON.SIZE({ theme: { spacing } })}
              verticalAlign="middle"
            />
          </StyledNode.Icon>
        )}
        {localBookmarked ? (
          <StyledNode.Icon ref={bookmarkEl} iconFill={bookmarkIconColor}>
            <BookmarkFillIcon
              size={ICON.SIZE({ theme: { spacing } })}
              verticalAlign="middle"
            />
          </StyledNode.Icon>
        ) : (
          <StyledNode.Icon ref={bookmarkEl}>
            <BookmarkIcon
              size={ICON.SIZE({ theme: { spacing } })}
              verticalAlign="middle"
            />
          </StyledNode.Icon>
        )}
      </StyledNode.RightIconContainer>
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
