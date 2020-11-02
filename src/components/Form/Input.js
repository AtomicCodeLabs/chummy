/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { INPUT } from '../../constants/sizes';
import {
  fieldColor,
  nodeTextColor,
  nodeLightTextColor,
  fontSize
} from '../../constants/theme';
import { ACCENT_COLOR } from '../../constants/colors';

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;

  background-color: ${fieldColor};
  color: ${nodeTextColor} !important;
  height: ${INPUT.HEIGHT}px;
  transition: box-shadow 100ms;
  box-shadow: 0 0 0 ${({ isFocused }) => (isFocused ? 1 : 0)}px ${ACCENT_COLOR};

  svg {
    // To keep consistent with RS's immutable styles
    transition: fill 100ms;
    padding-right: 0.3rem;
    width: 20px;
    fill: ${nodeLightTextColor};
    cursor: pointer;

    &:hover {
      fill: ${nodeTextColor};
    }
  }
`;

const StyledInput = styled.input`
  // Reset styles
  border: none;
  background-image: none;
  box-sizing: border-box;
  outline: none;
  box-shadow: none;
  background-color: transparent;

  color: ${nodeTextColor};
  flex: 1;
  font-size: ${fontSize};
  padding: 0.2rem calc(0.3rem + 2px); // To be compatible with react-select
  height: 100%;
`;

const Input = forwardRef(({ className, icon: Icon, ...inputProps }, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <InputContainer className={className} isFocused={isFocused}>
      <StyledInput
        {...inputProps}
        ref={ref}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {Icon}
    </InputContainer>
  );
});

Input.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.element
};

Input.defaultProps = {
  className: null,
  icon: null
};

export default Input;
