import styled, { css } from 'styled-components';

import {
  backgroundHighlightColor,
  lighterTextColor,
  smallFontSize,
  shadowColor,
  fieldMargin,
  labelMargin,
  indentPadding
} from '../../constants/theme';

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 2;
  ${({ hasShadow }) =>
    hasShadow &&
    css`
      box-shadow: 0px 2px 1px 0px ${shadowColor};
    `}
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.5rem;
  padding-left: ${fieldMargin}px;
`;

export const FormResultsDescriptionContainer = styled.div`
  color: ${lighterTextColor};
  font-size: ${smallFontSize};
  padding: 0 0.25rem 0.25rem ${indentPadding};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1;

  .react-select-optimized-option {
    &:hover {
      background-color: ${backgroundHighlightColor};
    }
  }

  .input-field {
    &:not(:last-child) {
      margin-bottom: ${fieldMargin}px;
    }
    &.is-technically-last {
      margin-bottom: 0 !important;
    }
  }
`;

export const Label = styled.label`
  font-size: ${smallFontSize};
  color: ${lighterTextColor};
  ${labelMargin}
`;

export const HideContainer = styled.div`
  display: ${({ isHidden }) => (isHidden ? 'none' : 'flex')};
  flex-direction: column;
  flex: 1;
`;

export const ContentContainer = styled.div`
  flex: 1;
`;
