import { Rnd } from 'react-rnd';
import styled from 'styled-components';

import {
  backgroundColor,
  textColor,
  highlightColor,
  unHighlightColor
} from '../../constants/theme';
import { SIDE_TAB } from '../../constants/sizes';

export const Container = styled.div`
  background-color: green;
  width: ${SIDE_TAB.WIDTH}px;
  height: 100vh;
  z-index: 10000;

  display: flex;
  flex-direction: row;
  overflow: hidden;
`;

export const SideTab = styled.div`
  background-color: lightblue;
  width: ${SIDE_TAB.WIDTH}px;
  z-index: 9999;
  overflow: hidden;

  display: flex;
  flex-direction: column;
`;

export const SideTabButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: white;
  height: ${SIDE_TAB.BUTTON.HEIGHT}px;

  border-left: ${SIDE_TAB.BUTTON.HIGHLIGHT_WIDTH}px solid
    ${({ active, ...scProps }) =>
      active ? highlightColor(scProps) : 'transparent'};
  padding-right: ${SIDE_TAB.BUTTON.HIGHLIGHT_WIDTH}px;

  svg {
    fill: ${({ active, ...scProps }) =>
      active ? highlightColor(scProps) : unHighlightColor(scProps)};
  }
`;

export const Expandable = styled(Rnd)`
  background-color: ${backgroundColor};
  color: ${textColor};
  z-index: 9998;
  overflow: hidden;
`;
