import styled, { css } from 'styled-components';
import { NODE } from '../../constants/sizes';

import {
  backgroundAlternatingDarkColor,
  backgroundAlternatingLightColor,
  BORDER_GRAY,
  shadowColor
} from '../../constants/theme';

export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  ${({ isDragging }) =>
    isDragging
      ? null
      : css`
          transition: 0.2s height;
        `}
`;

export const SectionNameContainer = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  padding-left: 0.2rem;
  /* border-top: 1px solid ${BORDER_GRAY}; */
  box-shadow: 0px 2px 1px 0px ${shadowColor};
  z-index: ${({ zIndex }) => zIndex};
  height: ${NODE.HEIGHT}px;
  max-height: ${NODE.HEIGHT}px;
`;

export const SectionName = styled.div`
  text-transform: uppercase;
  font-size: 0.75rem;
  line-height: ${NODE.HEIGHT}px;
  font-weight: bold;
  user-select: none;
`;

export const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  right: 0;
  min-width: fit-content;

  div.node:nth-of-type(even) {
    background-color: ${backgroundAlternatingLightColor};
  }
  div.node:nth-of-type(odd) {
    background-color: ${backgroundAlternatingDarkColor};
  }
`;
