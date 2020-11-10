import styled, { css } from 'styled-components';
import theme from 'styled-theming';
import { ICON } from '../../constants/sizes';
import {
  backgroundHighlightColor,
  backgroundHighlightTextColor,
  highlightBackgroundColor,
  lightTextColor,
  nodeIconColor,
  lighterTextColor,
  fontSize,
  indentPadding,
  highlightTextColor,
  backgroundHighlightDarkColor,
  backgroundHighlightDarkTextColor
} from '../../constants/theme';

const nodePadding = theme('spacing', {
  compact: css`
    padding-top: 0.15rem;
    padding-bottom: 0.15rem;
    padding-left: 0.8rem;
  `,
  cozy: css`
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
    padding-left: 0.8rem;
  `,
  comfortable: css`
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 0.8rem;
  `
});

const NodeRoot = styled.div`
  position: absolute;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${lightTextColor};
  ${nodePadding}

  cursor: pointer;

  &:hover {
    background-color: ${backgroundHighlightColor} !important;
    color: ${backgroundHighlightTextColor} !important;
    span {
      color: ${backgroundHighlightTextColor} !important;
    }
    svg {
      fill: ${backgroundHighlightTextColor};
    }
  }

  ${({ isActive }) =>
    isActive &&
    css`
      background-color: ${backgroundHighlightDarkColor} !important;
      color: ${backgroundHighlightDarkTextColor} !important;
      span {
        color: ${backgroundHighlightDarkTextColor} !important;
      }
      svg {
        fill: ${backgroundHighlightDarkTextColor} !important;
      }
    `}
`;

const LeftSpacer = styled.div`
  display: flex;
  width: calc(
    ${({ level, ...props }) =>
      `(1.2 * ${indentPadding(props)}) * ${level} - ${ICON.SIDE_MARGIN(
        props
      )}px`}
  );
  min-width: calc(
    ${({ level, ...props }) =>
      `(1.2 * ${indentPadding(props)}) * ${level} - ${ICON.SIDE_MARGIN(
        props
      )}px`}
  );
  margin-right: ${({ marginRight, extraIconFiller, ...props }) =>
    (extraIconFiller &&
      `calc(${ICON.SIZE(props)}px + ${ICON.SIDE_MARGIN(props)}px)`) ||
    marginRight ||
    '0'};
`;

const Icon = styled.div`
  display: flex;
  /* margin-left: ${({ marginLeft, ...props }) =>
    marginLeft || `${ICON.SIDE_MARGIN(props)}px`}; */
  margin-right: ${({ marginRight, ...props }) =>
    marginRight || `${ICON.SIDE_MARGIN(props)}px`};

  svg {
    fill: ${({ iconFill, ...props }) =>
      iconFill ? `${iconFill(props)} !important` : nodeIconColor(props)};
  }
`;

const RightIconContainer = styled.div`
  position: sticky;
  right: -1px;
  padding-right: calc(${ICON.SIDE_MARGIN}px + 1px);
  padding-left: ${ICON.SIDE_MARGIN}px;
  background-color: inherit;

  display: flex;
  flex-direction: row;

  svg {
    fill: ${({ iconFill, ...props }) =>
      iconFill ? `${iconFill(props)} !important` : nodeIconColor(props)};
  }
`;

const Name = styled.div`
  font-size: ${fontSize};
  user-select: none;
  /* color: ${lightTextColor}; */
  white-space: nowrap;

  span.highlight {
    color: ${highlightTextColor} !important;
    background-color: ${highlightBackgroundColor};
    padding: 0 0.2rem;
    border-radius: 3px;
  }

  span.italic {
    font-style: italic;
  }
`;

const SubName = styled.div`
  margin-left: 0.5rem;
  font-size: ${fontSize};
  user-select: none;
  color: ${lighterTextColor};
  white-space: nowrap;

  span.subpage {
    color: ${lightTextColor};
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
  NodeRoot,
  Container,
  LeftSpacer,
  Icon,
  RightIconContainer,
  Name,
  SubName,
  MiddleSpacer,
  StickyRight
};
