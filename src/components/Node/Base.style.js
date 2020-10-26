import styled, { css } from 'styled-components';
import { NODE } from '../../constants/sizes';
import {
  backgroundHighlightColor,
  textHighlightColor,
  nodeTextColor,
  nodeIconColor,
  nodeLightestTextColor
} from '../../constants/theme';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
  padding-left: 0.8rem;

  cursor: pointer;

  ${({ isActive }) =>
    isActive &&
    css`
      background-color: ${backgroundHighlightColor} !important;
    `}

  &:hover {
    background-color: ${backgroundHighlightColor} !important;
  }
`;

const LeftSpacer = styled.div`
  display: flex;
  width: ${({ level }) => 30 * level}px;
  min-width: ${({ level }) => 30 * level}px;
  margin-right: ${({ marginRight }) => marginRight || '0'};
`;

const Icon = styled.div`
  /* rotate a right caret icon */
  /* line-height: ${NODE.HEIGHT}px; */
  display: flex;
  margin-left: ${({ marginLeft }) => marginLeft || '0.2rem'};
  margin-right: ${({ marginRight }) => marginRight || '0.3rem'};

  svg {
    fill: ${({ iconFill }) => iconFill || nodeIconColor};
  }
`;

const Name = styled.div`
  /* line-height: ${NODE.HEIGHT}px; */
  font-size: 0.83rem;
  user-select: none;
  color: ${nodeTextColor};
  white-space: nowrap;

  span.highlight {
    background-color: ${textHighlightColor};
  }

  span.italic {
    font-style: italic;
  }
`;

const SubName = styled.div`
  margin-left: 0.5rem;
  font-size: 0.7rem;
  user-select: none;
  color: ${nodeLightestTextColor};
  white-space: nowrap;

  span.subpage {
    color: ${nodeTextColor};
  }
`;

const MiddleSpacer = styled.div`
  flex: 1;
`;

const StickyRight = styled.div`
  position: sticky;
  right: 0.5rem;
`;

export default {
  Container,
  LeftSpacer,
  Icon,
  Name,
  SubName,
  MiddleSpacer,
  StickyRight
};
