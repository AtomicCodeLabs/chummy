import styled, { css } from 'styled-components';

import {
  backgroundHighlightColor,
  nodeLightTextColor,
  fontSize,
  shadowColor,
  fieldMargin
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
  color: ${nodeLightTextColor};
  font-size: ${fontSize};
  padding: 0 0.5rem 0.5rem calc(14px + 0.5rem + 0.15rem); // to line up with search inputs
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

  .search-section-field {
    &:not(:last-child) {
      margin-bottom: ${fieldMargin}px;
    }
    &.is-technically-last {
      margin-bottom: 0 !important;
    }
  }
`;

export const Label = styled.label`
  font-size: ${fontSize};
`;

export const HideContainer = styled.div`
  display: ${({ isHidden }) => (isHidden ? 'none' : 'flex')};
  flex-direction: column;
  flex: 1;
`;
