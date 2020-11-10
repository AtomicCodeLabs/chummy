import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import { FileIcon, BookmarkSlashIcon } from '@primer/octicons-react';

import StyledNode from './Base.style';
import { redirectToUrl, processTabInformation, getBookmarkUrl } from './util';
import useFirebaseDAO from '../../hooks/firebase';
import useTheme from '../../hooks/useTheme';
import { ICON } from '../../constants/sizes';

const Bookmark = observer(({ bookmark }) => {
  const { spacing } = useTheme();
  const { removeBookmark } = useFirebaseDAO();
  const [showNewTab, setShowNewTab] = useState(false);
  console.log('BOOKMARK', bookmark);

  const handleClick = () => {
    // Always open search match file in new tab
    const toUrl = getBookmarkUrl(bookmark);
    redirectToUrl(toUrl);
  };
  const handleBookmarkClick = () => {
    // Remove bookmark
    removeBookmark();
  };
  const { primaryText, secondaryText, subpageText } = processTabInformation(
    bookmark.branch
  );

  return (
    <StyledNode.Container
      className="node"
      onClick={handleClick}
      onMouseEnter={() => setShowNewTab(true)}
      onMouseLeave={() => setShowNewTab(false)}
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
      {showNewTab && (
        <StyledNode.RightIconContainer>
          <BookmarkSlashIcon
            size={ICON.SIZE({ theme: { spacing } })}
            verticalAlign="middle"
            onClick={handleBookmarkClick}
          />
        </StyledNode.RightIconContainer>
      )}
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
    }).isRequired,
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired
  }).isRequired
};

export default Bookmark;
