import styled from 'styled-components';

import {
  fieldColor,
  backgroundHighlightColor,
  nodeLightestTextColor
} from '../../constants/theme';

export const FormContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.5rem;
`;

export const FormResultsDescriptionContainer = styled.div`
  color: ${nodeLightestTextColor};
  font-size: 0.75rem;
  padding: 0 0.5rem 0.5rem calc(14px + 0.5rem + 0.15rem); // to line up with search inputs
`;

export const IconContainer = styled.div`
  display: flex;
  padding: auto 0.05rem;
  margin-right: 0.15rem;
  cursor: pointer;

  &:hover {
    background-color: ${fieldColor};
  }
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
      margin-bottom: 0.15rem;
    }
    &.is-technically-last {
      margin-bottom: 0 !important;
    }
  }
`;

export const Label = styled.label`
  font-size: 0.75rem;
`;

export const HideContainer = styled.div`
  display: ${({ isHidden }) => (isHidden ? 'none' : 'flex')};
  flex-direction: column;
  flex: 1;
`;
