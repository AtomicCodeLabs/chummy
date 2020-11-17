import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  FileIcon,
  BookmarkIcon,
  BookmarkFillIcon
} from '@primer/octicons-react';

import StyledNode from './Base.style';
import OpenCloseChevron from '../OpenCloseChevron';
import { getMatchFragment, createBookmark, clickedEl } from './util';
import SearchResultMatchNode from './SearchResultMatchNode';
import useBookmarkState from '../../hooks/useBookmarkState';
import useTheme from '../../hooks/useTheme';
import { ICON } from '../../constants/sizes';
import { bookmarkIconColor } from '../../constants/theme';

const SearchResultFileNode = ({ file }) => {
  const {
    text_matches: textMatches,
    name,
    path,
    html_url: htmlUrl,
    repo
  } = file;
  const bookmark = createBookmark(repo.owner, repo.name, 'master', file);
  const bookmarkEl = useRef(null);
  const [open, setOpen] = useState(false);
  const parentPath = path.replace(name, '');
  const [localBookmarked, setLocalBookmarked] = useBookmarkState(
    bookmark,
    'Search'
  );
  const { spacing } = useTheme();

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    // Bookmark file
    if (clickedEl(bookmarkEl, e)) {
      setLocalBookmarked(!localBookmarked);
      return;
    }

    // Or toggle open state
    if (open) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const renderMatches = () =>
    open &&
    textMatches &&
    textMatches
      .map(
        ({ fragment, matches }, fileIndex) =>
          matches &&
          matches.map(({ indices }, textMatchIndex) => {
            const { matchFragment, start, end } = getMatchFragment(
              fragment,
              indices[0],
              indices[1]
            );
            return (
              <SearchResultMatchNode
                // eslint-disable-next-line react/no-array-index-key
                key={`${path}-${fileIndex}-${textMatchIndex}`}
                fragment={matchFragment}
                indices={{ start, end }}
                url={htmlUrl}
              />
            );
          })
      )
      .flat();

  // console.log(renderMatches());

  return (
    <>
      <StyledNode.Container className="node" onClickCapture={handleClick}>
        <StyledNode.LeftSpacer level={0} />
        <OpenCloseChevron open={open} />
        <StyledNode.Icon>
          <FileIcon size={14} verticalAlign="middle" />
        </StyledNode.Icon>
        <StyledNode.Name>{name}</StyledNode.Name>
        <StyledNode.SubName variant="smallFont">
          {parentPath}
        </StyledNode.SubName>
        <StyledNode.MiddleSpacer />
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
      </StyledNode.Container>
      {renderMatches()}
    </>
  );
};

// Shaped after data format given by rest api
SearchResultFileNode.propTypes = {
  file: PropTypes.shape({
    oid: PropTypes.string,
    text_matches: PropTypes.arrayOf(
      PropTypes.shape({
        fragment: PropTypes.string,
        matches: PropTypes.arrayOf(
          PropTypes.shape({
            indices: PropTypes.arrayOf(PropTypes.number),
            text: PropTypes.string
          })
        )
      })
    ),
    name: PropTypes.string,
    path: PropTypes.string,
    html_url: PropTypes.string,
    repo: PropTypes.shape({
      owner: PropTypes.string,
      name: PropTypes.string
    })
  }).isRequired
};

export default SearchResultFileNode;
