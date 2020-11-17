import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import { LinkExternalIcon } from '@primer/octicons-react';

import StyledNode from './Base.style';
import { redirectToUrl } from './util';
import useTheme from '../../hooks/useTheme';
import { ICON } from '../../constants/sizes';

const SearchResultMatchNode = observer(
  ({ fragment, indices: { start, end }, url }) => {
    const { spacing } = useTheme();
    const [showNewTab, setShowNewTab] = useState(false);

    const handleClick = (e) => {
      e.stopPropagation();
      e.preventDefault();

      // Always open search match file in new tab
      redirectToUrl(url);
    };

    return (
      <StyledNode.Container
        className="node"
        onClick={handleClick}
        onMouseEnter={() => setShowNewTab(true)}
        onMouseLeave={() => setShowNewTab(false)}
      >
        <StyledNode.LeftSpacer level={1} />
        <StyledNode.Name>
          <span className="italic">
            {fragment.slice(0, start)}
            <span className="highlight">{fragment.slice(start, end)}</span>
            {fragment.slice(end)}
          </span>
        </StyledNode.Name>
        <StyledNode.MiddleSpacer />
        <StyledNode.RightIconContainer>
          {showNewTab && (
            <StyledNode.Icon>
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