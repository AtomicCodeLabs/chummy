import styled, { css } from 'styled-components';

import {
  backgroundColor,
  textColor,
  nodeIconColor,
  sidebarColor,
  borderColor,
  sidebarActiveIconColor,
  sidebarInactiveIconColor,
  fontSize,
  indentPadding,
  backgroundAlternatingLightColor,
  backgroundAlternatingDarkColor
} from '../../constants/theme';
import { SIDE_TAB, HEADER } from '../../constants/sizes';

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
  background-color: ${sidebarColor};
  width: ${({ isSidebarMinimized }) =>
    isSidebarMinimized ? '100%' : `${SIDE_TAB.WIDTH}px`};
  z-index: 9999;
  overflow: hidden;

  display: flex;
  flex-direction: column;

  /* If sidebar color is the same as either alternating node colors
   * draw a right border for contrast
   */
  ${(props) =>
    (sidebarColor(props) === backgroundAlternatingDarkColor(props) ||
      sidebarColor(props) === backgroundAlternatingLightColor(props)) &&
    css`
      border-right: 1px solid ${borderColor};
    `}
`;

export const SideTabButton = styled.div`
  height: ${SIDE_TAB.BUTTON.HEIGHT}px;

  border-left: ${SIDE_TAB.BUTTON.HIGHLIGHT_WIDTH}px solid
    ${({ active, ...props }) =>
      active ? sidebarActiveIconColor(props) : 'transparent'};
  padding-right: ${SIDE_TAB.BUTTON.HIGHLIGHT_WIDTH}px;

  svg {
    fill: ${({ active, ...props }) =>
      active ? sidebarActiveIconColor(props) : sidebarInactiveIconColor(props)};
  }

  &:hover {
    svg {
      fill: ${sidebarActiveIconColor};
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
`;

export const ExpandingContainerDivider = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${borderColor};
`;
