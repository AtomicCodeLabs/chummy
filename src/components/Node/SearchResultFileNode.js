import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FileIcon } from '@primer/octicons-react';

import StyledNode from './Base.style';
import OpenCloseChevron from '../OpenCloseChevron';
import { useFileStore } from '../../hooks/store';
import { getMatchFragment } from './util';
import SearchResultMatchNode from './SearchResultMatchNode';

const SearchResultFileNode = ({
  file: { text_matches: textMatches, name, path, html_url: htmlUrl }
}) => {
  const {
    openOpenSearchResultFile,
    closeOpenSearchResultFile,
    isOpenSearchResultFileOpen
  } = useFileStore();
  const [open, setOpen] = useState(false);
  const parentPath = path.replace(name, '');

  useEffect(() => {
    setOpen(isOpenSearchResultFileOpen(path));
  }, [isOpenSearchResultFileOpen(path)]);

  const handleClick = () => {
    if (open) {
      closeOpenSearchResultFile(path);
      setOpen(false);
    } else {
      openOpenSearchResultFile(path);
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
      <StyledNode.Container className="node" onClick={handleClick}>
        <StyledNode.LeftSpacer level={0} />
        <OpenCloseChevron open={open} />
        <StyledNode.Icon>
          <FileIcon size={14} verticalAlign="middle" />
        </StyledNode.Icon>
        <StyledNode.Name>{name}</StyledNode.Name>
        <StyledNode.SubName variant="smallFont">
          {parentPath}
        </StyledNode.SubName>
      </StyledNode.Container>
      {renderMatches()}
    </>
  );
};

// Shaped after data format given by rest api
SearchResultFileNode.propTypes = {
  file: PropTypes.shape({
    text_matches: PropTypes.arrayOf(
      PropTypes.shape({
        fragment: PropTypes.string.isRequired,
        matches: PropTypes.arrayOf(
          PropTypes.shape({
            indices: PropTypes.arrayOf(PropTypes.number),
            text: PropTypes.string
          })
        )
      })
    ),
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    html_url: PropTypes.string.isRequired
  }).isRequired
};

export default SearchResultFileNode;
