import React, { useState, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import {
  FileIcon,
  LinkExternalIcon,
  BookmarkIcon,
  BookmarkFillIcon
} from '@primer/octicons-react';

import StyledNode from './Base.style';
import useFirebaseDAO from '../../hooks/firebase';
import { useFileStore, useUserStore } from '../../hooks/store';
import useTheme from '../../hooks/useTheme';
import { redirectTo, clickedEl } from './util';
import { ICON } from '../../constants/sizes';

const File = observer(({ owner, repo, branch, data, level }) => {
  const bookmark = {
    bookmarkId: `bookmark-${data.oid}`,
    pinned: false,
    ...data, // rest of Node
    repo: {
      owner,
      name: repo
    }
  };
  const [showNewTab, setShowNewTab] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const bookmarkEl = useRef(null);
  const newTabEl = useRef(null);
  const { spacing } = useTheme();

  const firebase = useFirebaseDAO();
  const { getUserBookmark } = useUserStore();
  const { currentWindowTab } = useFileStore();

  useEffect(() => {
    console.log(
      'bookmark updated',
      getUserBookmark(owner, repo, bookmark.bookmarkId)
    );
    setBookmarked(!!getUserBookmark(owner, repo, bookmark.bookmarkId) || false);
  }, [getUserBookmark(owner, repo, bookmark.bookmarkId)]);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    // Bookmark file
    if (clickedEl(bookmarkEl, e)) {
      // Check if bookmark already exists
      if (bookmarked) {
        console.log('removing bookmark', bookmark);
        firebase.removeBookmark(bookmark);
      } else {
        console.log('adding bookmark', bookmark);
        firebase.addBookmark(bookmark);
      }
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
          size={ICON.SIZE({ theme: { spacing } })}
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
        {bookmarked ? (
          <StyledNode.Icon ref={bookmarkEl}>
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
