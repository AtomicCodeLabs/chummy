import React, { useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  FileIcon,
  BookmarkIcon,
  BookmarkFillIcon
} from '@primer/octicons-react';

import StyledNode from './Base.style';
import OpenCloseChevron from '../OpenCloseChevron';
import {
  getMatchFragment,
  createBookmark,
  clickedEl,
  renderName
} from './util';
import { redirectToUrl } from '../../utils/browser';
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
    repo,
    queryFilename,
    queryCode
  } = file;
  const bookmark = createBookmark(
    repo.owner,
    repo.name,
    repo.defaultBranch,
    file
  );
  const bookmarkEl = useRef(null);
  const chevronEl = useRef(null);
  const [open, setOpen] = useState(false);
  const parentPath = path.replace(name, '');
  const [localBookmarked, setLocalBookmarked] = useBookmarkState(
    bookmark,
    'Search'
  );
  const { spacing } = useTheme();
  const hasMatches = textMatches.length !== 0;

  const isFileMatch = useMemo(
    () => textMatches.some((match) => match.property === 'path'),
    [textMatches]
  );
  const hasContentMatches = useMemo(
    () => textMatches.some((match) => match.property === 'content'),
    [textMatches]
  );

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    // Bookmark file
    if (clickedEl(bookmarkEl, e)) {
      setLocalBookmarked(!localBookmarked);
      return;
    }

    // Toggle Open State
    if (clickedEl(chevronEl, e)) {
      if (open) {
        setOpen(false);
      } else {
        setOpen(true);
      }
      return;
    }

    // Clicking anywhere else should open the file
    redirectToUrl(htmlUrl);
  };

  const renderMatches = () =>
    open &&
    hasMatches &&
    textMatches
      .map(
        ({ property, fragment, matches }, fileIndex) =>
          property !== 'path' && // Don't include path matches
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

  return (
    <>
      <StyledNode.Container className="node" onClickCapture={handleClick}>
        <StyledNode.LeftSpacer level={0} extraIconFiller={!hasContentMatches} />
        {hasContentMatches && <OpenCloseChevron open={open} ref={chevronEl} />}
        <StyledNode.Icon>
          <FileIcon size={14} verticalAlign="middle" />
        </StyledNode.Icon>
        <StyledNode.Name>
          {isFileMatch
            ? renderName(name, `${queryFilename} ${queryCode}`)
            : name}
        </StyledNode.Name>
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
      name: PropTypes.string,
      defaultBranch: PropTypes.string
    }),
    queryFilename: PropTypes.string,
    queryCode: PropTypes.string
  }).isRequired
};

export default SearchResultFileNode;
