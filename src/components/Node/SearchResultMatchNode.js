import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import { toJS } from 'mobx';
import { LinkExternalIcon } from '@primer/octicons-react';

import StyledNode from './Base.style';
import { useFileStore } from '../../hooks/store';
import { redirectToUrl } from './util';

const SearchResultMatchNode = observer(
  ({ fragment, indices: { start, end }, url }) => {
    const [showNewTab, setShowNewTab] = useState(false);
    const { currentWindowTab } = useFileStore();

    const handleClick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      // Always open search match file in new tab
      console.log(toJS(currentWindowTab));
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
        {showNewTab && (
          <>
            <StyledNode.MiddleSpacer />
            <StyledNode.Icon marginRight="1.5rem">
              <LinkExternalIcon size={14} verticalAlign="middle" />
            </StyledNode.Icon>
          </>
        )}
      </StyledNode.Container>
    );
  }
);

SearchResultMatchNode.propTypes = {
  fragment: PropTypes.string.isRequired,
  indices: PropTypes.shape({
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired
  }),
  url: PropTypes.string.isRequired
};

export default SearchResultMatchNode;
