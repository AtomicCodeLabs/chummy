import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import {
  FileIcon,
  BookmarkIcon,
  BookmarkFillIcon
} from '@primer/octicons-react';

import StyledNode from './Base.style';
import {
  redirectToUrl,
  processBookmarkInformation,
  getBookmarkUrl,
  clickedEl,
  highlightTextPart
} from './util';
import useTheme from '../../hooks/useTheme';
import useBookmarkState from '../../hooks/useBookmarkState';
import { ICON } from '../../constants/sizes';
import { bookmarkIconColor } from '../../constants/theme';

const Bookmark = observer(({ bookmark: { matches, ...bookmark } }) => {
  const { spacing } = useTheme();
  const bookmarkEl = useRef(null);
  const [localBookmarked, setLocalBookmarked] = useBookmarkState(
    bookmark,
    'Bookmarks'
  );

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    // Unbookmark file
    if (clickedEl(bookmarkEl, e)) {
      setLocalBookmarked(!localBookmarked);
      return;
    }

    // Or redirect to new tab
    // Always open search match file in new tab
    const toUrl = getBookmarkUrl(bookmark);
    redirectToUrl(toUrl);
  };

  const {
    primaryText: name, // name
    secondaryText: path, // path excluding file
    subpageText: branchName // branch
  } = processBookmarkInformation(bookmark);

  return (
    <StyledNode.Container
      className="node"
      onClickCapture={handleClick}
      // onMouseEnter={() => setShowNewTab(true)}
      // onMouseLeave={() => setShowNewTab(false)}
    >
      <StyledNode.LeftSpacer level={1} extraIconFiller />
      <StyledNode.Icon>
        <FileIcon
          size={ICON.SIZE({ theme: { spacing } })}
          verticalAlign="middle"
        />
      </StyledNode.Icon>
      <StyledNode.Name>{highlightTextPart(name, matches.name)}</StyledNode.Name>
      <StyledNode.SubName variant="smallFont">
        <span className="subpage">
          {highlightTextPart(branchName, matches.branchName)}
        </span>
        <span>/{highlightTextPart(path, matches.path)}</span>
      </StyledNode.SubName>
      <StyledNode.MiddleSpacer />
      {/* {showNewTab && ( */}
      <StyledNode.RightIconContainer>
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
      {/* )} */}
    </StyledNode.Container>
  );
});

Bookmark.propTypes = {
  bookmark: PropTypes.shape({
    bookmarkId: PropTypes.string.isRequired,
    pinned: PropTypes.boolean,
    repo: PropTypes.shape({
      owner: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired,
    branch: PropTypes.shape({
      name: PropTypes.string.isRequired
    }),
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    matches: PropTypes.objectOf(
      PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
    )
  }).isRequired
};

export default Bookmark;
