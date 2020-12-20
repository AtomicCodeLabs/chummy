import styled, { css } from 'styled-components';
import theme from 'styled-theming';
import {
  fontSize,
  indentPadding,
  lightTextColor,
  textColor,
  textSpacing,
  lineHeight,
  fieldBackgroundColor,
  h3FontSize
} from '../../constants/theme';

const innerPadding = theme('spacing', {
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
  background-color: ${fieldBackgroundColor};
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;

  padding: ${({ evenPadding, ...props }) =>
    evenPadding
      ? innerPadding(props)
      : `calc(${innerPadding(props)} * 1.5) ${innerPadding(props)}}`};

  ${({ highlightOnHover, ...props }) =>
    highlightOnHover &&
    css`
      &:hover {
        background-color: ${fieldBackgroundColor(props)};
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
`;

const Title = styled.div`
  font-size: ${h3FontSize};
  font-weight: 600;
  color: ${textColor};
  margin-bottom: ${textSpacing};
`;

const Description = styled.div`
  font-size: ${fontSize};
  color: ${lightTextColor};
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