import styled from 'styled-components';
import theme from 'styled-theming';
import {
  fontSize,
  indentPadding,
  lightTextColor,
  textColor,
  textSpacing,
  lineHeight,
  fieldBackgroundColor
} from '../../constants/theme';

const innerPadding = theme('spacing', {
  compact: '0.6rem',
  cozy: '0.8rem',
  comfortable: '1.2rem'
});

export const PanelsContainer = styled.div`
  padding: ${indentPadding} calc(${indentPadding} - ${innerPadding});
`;

const Container = styled.div`
  padding: ${innerPadding};

  &:hover {
    background-color: ${fieldBackgroundColor};
  }
`;

const Title = styled.div`
  font-size: ${fontSize};
  font-weight: 600;
  color: ${textColor};
  margin-bottom: ${textSpacing};
`;

const Description = styled.div`
  font-size: ${fontSize};
  color: ${lightTextColor};
  margin-bottom: ${textSpacing};
  line-height: ${lineHeight};
`;

export default {
  Container,
  Title,
  Description
};
