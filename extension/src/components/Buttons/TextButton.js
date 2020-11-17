import styled from 'styled-components';

import {
  fieldBackgroundColor,
  fieldBackgroundLightColor,
  fontSize,
  lightTextColor
} from '../../constants/theme';
import { BUTTON } from '../../constants/sizes';

const TextButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  height: ${BUTTON.HEIGHT}px;
  width: 100%;
  max-width: 270px;
  font-size: ${fontSize};
  text-decoration: none;
  color: ${lightTextColor};
  background-color: ${fieldBackgroundColor};
  cursor: pointer;
  &:hover {
    background-color: ${fieldBackgroundLightColor};
  }
`;

export default TextButton;
