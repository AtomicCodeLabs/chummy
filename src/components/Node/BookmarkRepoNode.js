import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { RepoIcon } from '@primer/octicons-react';

import StyledNode from './Base.style';
import Bookmark from './Bookmark';
import OpenCloseChevron from '../OpenCloseChevron';
import { useUserStore } from '../../hooks/store';
import useTheme from '../../hooks/useTheme';
import { ICON } from '../../constants/sizes';

const BookmarkRepoNode = ({ repo }) => {
  const { spacing } = useTheme();
  const {
    openUserBookmarksRepo,
    closeUserBookmarksRepo,
    getUserBookmarkRepo
  } = useUserStore();
  const [open, setOpen] = useState(false);
  const hasBookmarks = !!Object.keys(repo.bookmarks).length;

  useEffect(() => {
    setOpen(getUserBookmarkRepo(repo.owner, repo.name)?.isOpen || false);
  }, [getUserBookmarkRepo(repo.owner, repo.name)]);

  const handleClick = () => {
    if (open) {
      closeUserBookmarksRepo(repo.owner, repo.name);
      setOpen(false);
    } else {
      openUserBookmarksRepo(repo.owner, repo.name);
      setOpen(true);
    }
  };

  return (
    <>
      <StyledNode.Container className="node" onClick={handleClick}>
        <StyledNode.LeftSpacer level={0} />
        <OpenCloseChevron open={open} />
        <StyledNode.Icon>
          <RepoIcon
            size={ICON.SIZE({ theme: { spacing } })}
            verticalAlign="middle"
          />
        </StyledNode.Icon>
        <StyledNode.Name>
          {repo.owner}/{repo.name}
        </StyledNode.Name>
      </StyledNode.Container>
      <>
        {open &&
          hasBookmarks &&
          Object.values(repo.bookmarks).map((bookmark) => (
            <Bookmark
              key={`${bookmark.name}#${bookmark.bookmarkId}`}
              bookmark={bookmark}
            />
          ))}
      </>
    </>
  );
};

BookmarkRepoNode.propTypes = {
  repo: PropTypes.shape({
    owner: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    bookmarks: PropTypes.objectOf(
      PropTypes.shape({
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
      })
    )
  }).isRequired
};

export default BookmarkRepoNode;
