import styled from 'styled-components';

import { INPUT } from '../../constants/sizes';
import {
  fieldColor,
  backgroundHighlightColor,
  ACCENT_COLOR,
  nodeTextColor
} from '../../constants/theme';

export const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.5rem;
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

export const Input = styled.input`
  // Reset styles
  border: none;
  background-image: none;
  box-sizing: border-box;
  outline: none;
  box-shadow: none;

  font-size: 0.75rem;
  background-color: ${fieldColor};
  height: ${INPUT.HEIGHT}px;
  padding: 0.2rem calc(0.3rem + 2px); // To be compatible with react-select
  transition: box-shadow 100ms;
  color: ${nodeTextColor};
  &:focus {
    box-shadow: 0 0 0 1px ${ACCENT_COLOR};
  }
`;

// export const Select = styled.select`
//   // Reset styles
//   border: none;
//   background-image: none;
//   -webkit-box-shadow: none;
//   -moz-box-shadow: none;
//   box-shadow: none;
//   outline: none;
//   &:focus {
//     outline: none;
//   }

//   background-color: lightcyan;
//   height: ${NODE.HEIGHT}px;
//   padding: 0.1rem 0.2rem;
// `;
