/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';

import IconWithSubIcon from './IconWithSubIcon';
import { smallestFontSize } from '../../constants/theme';
import { useUiStore } from '../../hooks/store';
import { isBlank } from '../../utils';

const iconPadding = 6;

const Circle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(4px + ${iconPadding}px);
  height: calc(4px + ${iconPadding}px);
  position: absolute;
  border-radius: 100%;
  background-color: ${({ color, ...props }) => color(props)};
`;

const Subtext = styled.span`
  position: absolute;
  font-size: ${smallestFontSize};
  color: ${({ color, ...props }) => color(props)};
`;

export default observer(
  ({
    Icon,
    subtext = '',
    subtextContext,
    hasBadgeContext,
    badgeColor,
    fontColor
  }) => {
    const uiStore = useUiStore();
    const subtextToShow = subtextContext ? uiStore[subtextContext] : subtext;
    const hasBadge = hasBadgeContext ? uiStore[hasBadgeContext] : false;
    return (
      <IconWithSubIcon
        Icon={Icon}
        SubIcon={
          hasBadge ? (
            <Circle color={badgeColor}>
              {!isBlank(subtextContext) && (
                <Subtext color={fontColor}>{subtextToShow}</Subtext>
              )}
            </Circle>
          ) : (
            <></>
          )
        }
        // Subtext={}
      />
    );
  }
);
