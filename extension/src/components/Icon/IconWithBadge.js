/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';

import IconWithSubIcon from './IconWithSubIcon';
import { smallestFontSize } from '../../constants/theme';
import { useUiStore } from '../../hooks/store';

const iconPadding = 8;

const Circle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(${smallestFontSize} + ${iconPadding}px);
  height: calc(${smallestFontSize} + ${iconPadding}px);
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
  ({ Icon, subtext = '', subtextContext, badgeColor, fontColor }) => {
    const uiStore = useUiStore();
    const subtextToShow = subtextContext ? uiStore[subtextContext] : subtext;
    return (
      <IconWithSubIcon
        Icon={Icon}
        SubIcon={
          <Circle color={badgeColor}>
            <Subtext color={fontColor}>{subtextToShow}</Subtext>
          </Circle>
        }
        // Subtext={}
      />
    );
  }
);
