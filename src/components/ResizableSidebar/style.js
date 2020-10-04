import styled from 'styled-components';

import {
  backgroundColor,
  textColor,
  WHITE,
  PRIMARY_COLOR,
  GRAY,
  BORDER_GRAY,
  ACCENT_COLOR
} from '../../constants/theme';
import { SIDE_TAB, HEADER, RESIZE_GUTTER } from '../../constants/sizes';

export const Container = styled.div`
  background-color: ${PRIMARY_COLOR};
  width: 100%;
  height: 100vh;
  z-index: 10000;

  display: flex;
  flex-direction: row;
  overflow: hidden;
`;

export const SideTab = styled.div`
  background-color: ${PRIMARY_COLOR};
  width: ${({ isSidebarMinimized }) =>
    isSidebarMinimized ? '100%' : `${SIDE_TAB.WIDTH}px`};
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

export const ExpandingContainer = styled.div`
  display: flex !important;
  flex-direction: column;
  overflow: hidden;
  width: ${({ isSidebarMinimized }) =>
    isSidebarMinimized ? '0' : `calc(100vw - ${SIDE_TAB.WIDTH}px)`};
  height: 100vh;
  position: absolute;
  z-index: 9998;
  left: ${SIDE_TAB.WIDTH}px;
  top: 0;

  background-color: ${backgroundColor};
  color: ${textColor};
`;

export const ExpandingContainerHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 1rem;

  background-color: ${backgroundColor};
  height: ${HEADER.HEIGHT}px;
  color: ${textColor};
  font-size: 0.75rem;
  text-transform: uppercase;
`;

export const ExpandingContainerContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  /* // For some reason, drag cursor disappears after first drag */
  /* // https://github.com/nathancahill/split/issues/99 */
  .gutter-container {
    background-color: transparent;
    width: 100%;
    position: absolute;
    height: 0;
    /* left: 16px; Magic number that works */
    cursor: row-resize;
    border-top: 1px ${BORDER_GRAY} solid;

    .custom-gutter {
      position: relative;
      height: inherit;
      top: -${RESIZE_GUTTER.HEIGHT}px;
      &:hover {
        border-bottom: 1px ${ACCENT_COLOR} solid;
      }
    }
  }
`;

export const ExpandingContainerDivider = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${BORDER_GRAY};
`;
