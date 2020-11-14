import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { RepoIcon } from '@primer/octicons-react';

import StyledNode from './Base.style';
import Bookmark from './Bookmark';
import OpenCloseChevron from '../OpenCloseChevron';
import { useUserStore } from '../../hooks/store';
import useTheme from '../../hooks/useTheme';
import { ICON } from '../../constants/sizes';

const BookmarkRepoNode = ({ repo, repoMatches }) => {
  const { spacing } = useTheme();
  const {
    openUserBookmarksRepo,
    closeUserBookmarksRepo,
    getUserBookmarkRepo
  } = useUserStore();
  const [open, setOpen] = useState(true);
  const hasBookmarks = !!Object.keys(repoMatches).length;

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
          Object.entries(repoMatches).map(
            ([bookmarkId, { matches }]) =>
              repo.bookmarks[bookmarkId] && (
                <Bookmark
                  key={bookmarkId}
                  bookmark={{ ...repo.bookmarks[bookmarkId], matches }}
                />
              )
          )}
      </>
    </>
  );
};

BookmarkRepoNode.propTypes = {
  repo: PropTypes.shape({
    owner: PropTypes.string,
    name: PropTypes.string,
    bookmarks: PropTypes.objectOf(
      PropTypes.shape({
        bookmarkId: PropTypes.string,
        pinned: PropTypes.boolean,
        repo: PropTypes.shape({
          owner: PropTypes.string,
          name: PropTypes.string
        }),
        branch: PropTypes.shape({
          name: PropTypes.string
        }),
        name: PropTypes.string,
        path: PropTypes.string
      })
    )
  }).isRequired,
  repoMatches: PropTypes.objectOf(
    PropTypes.shape({
      matches: PropTypes.objectOf(
        PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
      )
    })
  ).isRequired
};

export default BookmarkRepoNode;
