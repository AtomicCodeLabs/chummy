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
  monoFontSize,
  indentPadding,
  highlightTextColor,
  backgroundHighlightDarkColor,
  backgroundHighlightDarkTextColor
} from '../../constants/theme';

// fontsize + nodeTopPadding + nodeBottomPadding
export const nodeHeight = theme('spacing', {
  compact: `calc(0.75rem + (2 * 0.5rem))`,
  cozy: `calc(0.8rem + (2 * 0.7rem))`,
  comfortable: `calc(0.83rem + (2 * 0.9rem))`
});

export const nodePaddingY = theme('spacing', {
  compact: css`
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  `,
  cozy: css`
    padding-top: 0.7rem;
    padding-bottom: 0.7rem;
  `,
  comfortable: css`
    padding-top: 0.9rem;
    padding-bottom: 0.9rem;
  `
});

export const nodePaddingX = theme('spacing', {
  compact: css`
    padding-left: 0.8rem;
    padding-right: 0.8rem;
  `,
  cozy: css`
    padding-left: 0.8rem;
    padding-right: 0.8rem;
  `,
  comfortable: css`
    padding-left: 0.8rem;
    padding-right: 0.8rem;
  `
});

export const nodePadding = theme('spacing', {
  compact: css`
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 0.8rem;
  `,
  cozy: css`
    padding-top: 0.7rem;
    padding-bottom: 0.7rem;
    padding-left: 0.8rem;
  `,
  comfortable: css`
    padding-top: 0.9rem;
    padding-bottom: 0.9rem;
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
  max-height: ${nodeHeight};
  box-sizing: border-box;
  ${nodePadding}

  cursor: ${({ noPointer }) => !noPointer && 'pointer'};

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

export const Icon = styled.div`
  display: flex;
  /* margin-left: ${({ marginLeft, ...props }) =>
    marginLeft || `${ICON.SIDE_MARGIN(props)}px`}; */
  margin-right: ${({ marginRight, ...props }) =>
    marginRight || `${ICON.SIDE_MARGIN(props)}px`};

  cursor: pointer;

  svg {
    fill: ${({ iconFill, ...props }) =>
      iconFill ? `${iconFill(props)} !important` : nodeIconColor(props)};
  }

  ${({ hoverable, disabled }) =>
    disabled
      ? css`
          opacity: 0.5;
          cursor: not-allowed;
        `
      : hoverable &&
        css`
          opacity: 0.7;
          &:hover {
            opacity: 1;
          }
        `}
`;

export const RightIconContainer = styled.div`
  position: sticky;
  right: -1px;
  padding-right: calc(${ICON.SIDE_MARGIN}px + 1px);
  padding-left: ${ICON.SIDE_MARGIN}px;
  background-color: inherit;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

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
    padding: 0 0.1rem;
    margin: 0 0.05rem;
    border-radius: 2px;
  }

  span.mono {
    /* Github's monospace stack */
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier,
      monospace;
    user-select: text;
    font-size: ${monoFontSize};
  }
`;

const SubName = styled.div`
  margin-left: 0.5rem;
  font-size: ${fontSize};
  user-select: none;
  color: ${lighterTextColor};
  white-space: nowrap;

  span.highlight {
    color: ${highlightTextColor} !important;
    background-color: ${highlightBackgroundColor};
    padding: 0 0.1rem;
    margin: 0 0.05rem;
    border-radius: 2px;
  }

  span.subpage {
    color: ${lightTextColor};
  }
`;

export const MiddleSpacer = styled.div`
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
