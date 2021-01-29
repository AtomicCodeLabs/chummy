import styled, { css } from 'styled-components';
import { ICON, NODE } from '../../constants/sizes';

import {
  backgroundAlternatingDarkColor,
  backgroundAlternatingLightColor,
  borderColor,
  fontSize,
  indentPadding,
  shadowColor
} from '../../constants/theme';

export const SectionContainer = styled.div`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  height: 100%;
  user-select: none;
  transition: 0.2s height;
  box-sizing: border-box;
  z-index: 1;
`;

export const SectionNameContainer = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  padding-left: calc(${indentPadding} - ${ICON.SIZE}px - ${ICON.SIDE_MARGIN}px);
  z-index: ${({ zIndex }) => zIndex};
  height: ${NODE.HEIGHT}px;
  max-height: ${NODE.HEIGHT}px;

  border-top: 1px solid ${borderColor};
  ${({ hasShadow }) =>
    hasShadow &&
    css`
      box-shadow: 0px 2px 1px 0px ${shadowColor};
    `}
`;

export const SectionName = styled.div`
  text-transform: uppercase;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: ${fontSize};
  line-height: ${NODE.HEIGHT}px;
  font-weight: bold;
  user-select: none;
  overflow: hidden;
`;

export const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  left: 0;
  right: 0;
  min-width: fit-content;
  height: 100%;

  div.node:nth-of-type(even) {
    background-color: ${backgroundAlternatingLightColor};
  }
  div.node:nth-of-type(odd) {
    background-color: ${backgroundAlternatingDarkColor};
  }
`;
