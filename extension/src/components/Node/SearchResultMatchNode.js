import React, { useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import { LinkExternalIcon } from '@primer/octicons-react';

import StyledNode from './Base.style';
import { clickedEl } from './util';
import { redirectToUrl } from '../../utils/browser';
import useTheme from '../../hooks/useTheme';
import { ICON } from '../../constants/sizes';

const SearchResultMatchNode = observer(
  ({ fragment, indices: { start, end }, url }) => {
    const { spacing } = useTheme();
    const linkEl = useRef(null);
    const [showNewTab, setShowNewTab] = useState(false);

    const handleClick = (e) => {
      e.stopPropagation();
      e.preventDefault();

      // Open search match file in new tab
      if (clickedEl(linkEl, e)) {
        redirectToUrl(url);
      }
    };

    return (
      <StyledNode.Container
        className="node"
        onClickCapture={handleClick}
        onMouseEnter={() => setShowNewTab(true)}
        onMouseLeave={() => setShowNewTab(false)}
        noPointer
      >
        <StyledNode.LeftSpacer level={1} />
        <StyledNode.Name>
          <span className="mono">
            {fragment.slice(0, start)}
            <span className="highlight">{fragment.slice(start, end)}</span>
            {fragment.slice(end)}
          </span>
        </StyledNode.Name>
        <StyledNode.MiddleSpacer />
        <StyledNode.RightIconContainer>
          {showNewTab && (
            <StyledNode.Icon ref={linkEl}>
              <LinkExternalIcon
                size={ICON.SIZE({ theme: { spacing } })}
                verticalAlign="middle"
              />
            </StyledNode.Icon>
          )}
        </StyledNode.RightIconContainer>
      </StyledNode.Container>
    );
  }
);

SearchResultMatchNode.propTypes = {
  fragment: PropTypes.string,
  indices: PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number
  }),
  url: PropTypes.string
};

export default SearchResultMatchNode;
