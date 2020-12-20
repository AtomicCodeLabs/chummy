import styled, { css } from 'styled-components';
import {
  h1FontSize,
  h2FontSize,
  h3FontSize,
  h1MarginSize,
  h2MarginSize,
  h3MarginSize,
  fontSize,
  lineHeight
} from '../../constants/theme';

export const P = styled.p`
  font-size: ${fontSize};
  font-weight: 400;
  line-height: ${lineHeight};
  ${({ center }) =>
    center &&
    css`
      text-align: center;
    `}
`;

export const H1 = styled.h1`
  font-size: ${h1FontSize};
  font-weight: 600;
  margin: ${h1MarginSize} 0;
  ${({ center }) =>
    center &&
    css`
      text-align: center;
    `}
`;

export const H2 = styled.h2`
  font-size: ${h2FontSize};
  font-weight: 600;
  margin: ${h2MarginSize} 0;
  ${({ center }) =>
    center &&
    css`
      text-align: center;
    `}
`;

export const H3 = styled.h3`
  font-size: ${h3FontSize};
  font-weight: 600;
  margin: ${h3MarginSize} 0;
  ${({ center }) =>
    center &&
    css`
      text-align: center;
    `}
`;