import styled from 'styled-components';
import {
  h1FontSize,
  h2FontSize,
  h3FontSize,
  fontSize
} from '../../constants/theme';

export const P = styled.p`
  font-size: ${fontSize};
  font-weight: 400;
`;

export const H1 = styled.h1`
  font-size: ${h1FontSize};
  font-weight: 600;
`;

export const H2 = styled.h2`
  font-size: ${h2FontSize};
  font-weight: 600;
`;

export const H3 = styled.h3`
  font-size: ${h3FontSize};
  font-weight: 600;
`;
