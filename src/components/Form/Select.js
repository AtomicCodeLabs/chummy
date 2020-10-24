/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, useMemo } from 'react';
import styled, { ThemeContext, css } from 'styled-components';
import ReactSelect, { createFilter } from 'react-select';
import { Controller } from 'react-hook-form';

import { INPUT } from '../../constants/sizes';
import {
  backgroundColor,
  backgroundHighlightColor,
  backgroundHighlightDarkColor,
  ACCENT_COLOR,
  nodeTextColor,
  invertedNodeTextColor,
  FIELD_COLOR_LIGHT,
  FIELD_COLOR_DARK,
  NODE_TEXT_COLOR_LIGHT,
  NODE_TEXT_COLOR_DARK
} from '../../constants/theme';

const StyledOptionContainer = styled.div`
  display: flex;
  align-items: center;

  background-color: ${({ isSelected, ...props }) =>
    isSelected
      ? `${backgroundHighlightDarkColor(props)}`
      : `${backgroundColor(props)}`};
  color: ${({ isSelected, ...props }) =>
    isSelected ? `${invertedNodeTextColor(props)}` : `${nodeTextColor(props)}`};
  height: ${INPUT.SELECT.OPTION.HEIGHT}px;
  padding: 0.2rem calc(0.6rem + 4px);
  font-size: 0.75rem;
  cursor: pointer;

  ${({ isSelected, ...props }) =>
    !isSelected &&
    css`
      &:hover {
        background-color: ${backgroundHighlightColor(props)} !important;
      }
    `}
`;

const Option = (props) => {
  const {
    children,
    className = '',
    cx,
    getStyles,
    isDisabled,
    isFocused,
    isSelected,
    innerRef,
    innerProps
  } = props;
  delete props.innerProps.onMouseMove;
  delete props.innerProps.onMouseOver;
  if (isSelected) console.log('OPTION', children, isSelected);
  return (
    <StyledOptionContainer
      ref={innerRef}
      css={getStyles('option', props)}
      isSelected={isSelected}
      className={cx(
        {
          option: true,
          'option--is-disabled': isDisabled,
          'option--is-focused': isFocused,
          'option--is-selected': isSelected
        },
        `${className} custom-react-select-option`
      )}
      {...innerProps}
    >
      {children}
    </StyledOptionContainer>
  );
};

// React Hook Form wrapper around React Select
const Select = (props) => {
  const { theme: mode } = useContext(ThemeContext);
  const customReactSelectStyles = useMemo(
    () => ({
      control: (base) => ({
        ...base,
        backgroundColor:
          mode === 'light' ? FIELD_COLOR_LIGHT : FIELD_COLOR_DARK,
        height: INPUT.SELECT.HEIGHT,
        minHeight: 'auto',
        padding: '0.2rem 0.3rem',
        border: 0,
        outline: 'none',
        cursor: 'text'
      }),
      input: (base) => ({
        ...base,
        minHeight: 'auto',
        color: mode === 'light' ? NODE_TEXT_COLOR_LIGHT : NODE_TEXT_COLOR_DARK
      }),
      dropdownIndicator: (base) => ({
        ...base,
        padding: 0
      }),
      indicatorContainer: (base) => ({
        ...base,
        boxSizing: 'border-box',
        padding: 0,
        margin: 0
      }),
      indicatorSeparator: (base) => ({
        ...base,
        display: 'none'
      }),
      singleValue: (base) => ({
        ...base
      }),
      valueContainer: (base) => ({
        ...base,
        padding: 0,
        margin: 0
      }),
      menu: (base) => ({
        ...base,
        borderRadius: 0,
        hyphens: 'auto',
        marginTop: 0,
        textAlign: 'left',
        wordWrap: 'break-word'
      }),
      menuList: (base) => ({
        ...base,
        // kill the white space on first and last option
        padding: 0
      }),
      groupHeading: (base) => ({
        ...base,
        padding: '0.2rem calc(0.3rem + 2px)'
      })
    }),
    [mode]
  );
  const {
    name,
    control,
    rules,
    onFocus,
    onChange: rsOnChange,
    defaultValue,
    ...reactSelectProps
  } = props;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      onFocus={onFocus}
      defaultValue={defaultValue}
      render={({ onChange: rhfOnChange, onBlur, value }) => (
        <ReactSelect
          onBlur={onBlur}
          onChange={(option) => {
            rhfOnChange(option);
            rsOnChange(option);
          }}
          name={name}
          filterOption={createFilter({ ignoreAccents: false })}
          components={{ Option }}
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary: ACCENT_COLOR
            }
          })}
          value={value}
          styles={customReactSelectStyles}
          {...reactSelectProps}
        />
      )}
    />
  );
};

export default Select;
