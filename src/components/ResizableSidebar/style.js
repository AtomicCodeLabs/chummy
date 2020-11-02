import styled from 'styled-components';

import {
  backgroundColor,
  textColor,
  nodeIconColor,
  sideBarColor,
  fontSize,
  indentPadding
} from '../../constants/theme';
import { WHITE, GRAY, BORDER_GRAY, ACCENT_COLOR } from '../../constants/colors';
import { SIDE_TAB, HEADER, RESIZE_GUTTER } from '../../constants/sizes';

export const Container = styled.div`
  background-color: ${backgroundColor};
  width: 100%;
  height: 100vh;
  z-index: 10000;

  display: flex;
  flex-direction: row;
  overflow: hidden;
`;

export const SideTab = styled.div`
  background-color: ${sideBarColor};
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

export const ExpandingContainerHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: ${indentPadding};

  background-color: ${backgroundColor};
  height: ${HEADER.HEIGHT}px;
  color: ${textColor};
  font-size: ${fontSize};
  text-transform: uppercase;
`;

export const ExpandingContainerHeaderSpacer = styled.div`
  flex: 1;
`;

export const ExpandingContainerHeaderIcon = styled.div`
  display: flex;
  margin-left: ${({ marginLeft }) => marginLeft || '0.5rem'};
  margin-right: ${({ marginRight }) => marginRight || '0.5rem'};

  svg {
    fill: ${({ iconFill }) => iconFill || nodeIconColor};
  }
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
