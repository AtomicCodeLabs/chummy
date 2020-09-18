import { Rnd } from 'react-rnd';
import styled from 'styled-components';

import {
  backgroundColor,
  textColor,
  WHITE,
  PRIMARY_COLOR,
  GRAY,
  BORDER_GRAY
} from '../../constants/theme';
import { SIDE_TAB } from '../../constants/sizes';

export const Container = styled.div`
  background-color: ${PRIMARY_COLOR};
  width: ${SIDE_TAB.WIDTH}px;
  height: 100vh;
  z-index: 10000;

  display: flex;
  flex-direction: row;
  overflow: hidden;
`;

export const SideTab = styled.div`
  background-color: ${PRIMARY_COLOR};
  width: ${SIDE_TAB.WIDTH}px;
  z-index: 9999;
  overflow: hidden;

  display: flex;
  flex-direction: column;
`;

export const SideTabButton = styled.div`
  height: ${SIDE_TAB.BUTTON.HEIGHT}px;

  border-left: ${SIDE_TAB.BUTTON.HIGHLIGHT_WIDTH}px solid
    ${({ active }) => (active ? WHITE : 'transparent')};
  padding-right: ${SIDE_TAB.BUTTON.HIGHLIGHT_WIDTH}px;

  svg {
    fill: ${({ active }) => (active ? WHITE : GRAY)};
  }

  &:hover {
    svg {
      fill: ${WHITE};
    }
  }
`;

export const FlexGrow = styled.div`
  flex: 1;
`;

export const ExpandingContainer = styled(Rnd)`
  background-color: ${backgroundColor};
  border-right: 1px solid ${BORDER_GRAY};
  color: ${textColor};
  z-index: 9998;
  overflow: hidden;

  display: flex !important;
  flex-direction: column;
`;

export const ExpandingContainerHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 1rem;

  background-color: ${backgroundColor};
  height: 40px;
  color: ${textColor};
  font-size: 0.8rem;
  text-transform: uppercase;
`;

export const ExpandingContainerContent = styled.div`
  flex: 1;
  white-space: nowrap;
`;

export const ExpandingContainerDivider = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${BORDER_GRAY};
`;

export const ExpandingContainerMinimizer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  padding: 0.5rem 1rem;
  height: ${SIDE_TAB.WIDTH}px;
  width: 100%;
`;
