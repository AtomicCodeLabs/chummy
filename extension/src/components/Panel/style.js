import styled, { css } from 'styled-components';
import theme from 'styled-theming';
import {
  fontSize,
  indentPadding,
  textSpacing,
  lineHeight,
  h3FontSize,
  themeType,
  backgroundColor,
  lighterTextColor,
  smallFontSize
} from '../../constants/theme';
import { highlightColor } from '../../config/theme/utils';

export const innerPadding = theme('spacing', {
  compact: '0.6rem',
  cozy: '0.8rem',
  comfortable: '1.2rem'
});

export const PanelsContainer = styled.div`
  padding: ${indentPadding} calc(${indentPadding} - ${innerPadding});
`;

export const PanelDivider = styled.div`
  margin: -1px calc(${indentPadding} - ${innerPadding});
  height: 1px;
  background-color: ${({ bgColor = backgroundColor, ...props }) =>
    highlightColor(bgColor(props), themeType(props))};
`;

export const PanelDescriptionContainer = styled.div`
  display: flex;
  color: ${lighterTextColor};
  font-size: ${smallFontSize};
  padding: 0 calc(${indentPadding} - ${innerPadding}) 0.25rem ${indentPadding};

  .spacer {
    flex: 1;
  }
`;

export const PanelDivider2 = styled.div`
  height: ${innerPadding};
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  background-color: 'transparent';
  border-radius: ${({ borderRadius }) => borderRadius};

  color: ${({ fontColor }) => fontColor};

  ${({ borderLeftColor, ...props }) =>
    borderLeftColor &&
    css`
      border-left: 5px solid ${borderLeftColor(props)};
    `}

  padding: ${({ evenPadding, ...props }) =>
    evenPadding
      ? innerPadding(props)
      : `calc(${innerPadding(props)} * 1.5) ${innerPadding(props)}}`};

  ${({ highlightOnHover, bgColor, ...props }) =>
    highlightOnHover &&
    css`
      &:hover {
        background-color: ${highlightColor(bgColor(props), themeType(props))};
      }
    `};

  ${({ onClick }) =>
    onClick &&
    css`
      cursor: pointer;
    `}
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  font-size: ${fontSize};
`;

const Title = styled.div`
  font-size: ${h3FontSize};
  font-weight: 600;
  color: ${({ fontColor, ...props }) => fontColor(props)};
  margin-bottom: ${textSpacing};

  span.strikethrough {
    text-decoration: line-through;
  }

  span {
    margin-right: 0.2rem;
  }
`;

const Description = styled.div`
  font-size: ${fontSize};
  color: ${({ fontColor, ...props }) => fontColor(props)};
  margin-bottom: ${({ isLast, ...props }) =>
    isLast ? '0' : `${textSpacing(props)}`};
  line-height: ${lineHeight};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ center }) => (center ? 'center' : 'flex-start')};
  width: 100%;
`;

export default {
  Container,
  LeftPanel,
  RightPanel,
  Title,
  Description,
  Content
};
