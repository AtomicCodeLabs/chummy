import styled, { css } from 'styled-components';
import theme from 'styled-theming';
import { BLACK } from '../../constants/colors';
import { ICON } from '../../constants/sizes';
import {
  backgroundHighlightColor,
  textHighlightColor,
  nodeTextColor,
  nodeIconColor,
  nodeLightTextColor,
  fontSize,
  indentPadding
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

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${nodePadding}

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
  width: calc(
    ${({ level, ...props }) =>
      `(1.5 * ${indentPadding(props)}) * ${level} - ${ICON.SIDE_MARGIN(
        props
      )}px`}
  );
  min-width: calc(
    ${({ level, ...props }) =>
      `(1.5 * ${indentPadding(props)}) * ${level} - ${ICON.SIDE_MARGIN(
        props
      )}px`}
  );
  margin-right: ${({ marginRight }) => marginRight || '0'};
`;

const Icon = styled.div`
  display: flex;
  /* margin-left: ${({ marginLeft, ...props }) =>
    marginLeft || `${ICON.SIDE_MARGIN(props)}px`}; */
  margin-right: ${({ marginRight, ...props }) =>
    marginRight || `${ICON.SIDE_MARGIN(props)}px`};

  svg {
    fill: ${({ iconFill }) => iconFill || nodeIconColor};
  }
`;

const Name = styled.div`
  font-size: ${fontSize};
  user-select: none;
  color: ${nodeTextColor};
  white-space: nowrap;

  span.highlight {
    color: ${BLACK};
    background-color: ${textHighlightColor};
  }

  span.italic {
    font-style: italic;
  }
`;

const SubName = styled.div`
  margin-left: 0.5rem;
  font-size: ${fontSize};
  user-select: none;
  color: ${nodeLightTextColor};
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
