/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import ReactSelect, { createFilter } from 'react-select';
import { Controller } from 'react-hook-form';

import { INPUT } from '../../constants/sizes';
import {
  backgroundColor,
  backgroundHighlightColor,
  backgroundHighlightDarkColor,
  nodeTextColor,
  invertedNodeTextColor,
  fontSize,
  fieldColor,
  nodeLightTextColor
} from '../../constants/theme';
import { ACCENT_COLOR } from '../../constants/colors';
import useTheme from '../../hooks/useTheme';

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
  font-size: ${fontSize};
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

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

export const Select = (props) => {
  const { theme: mode, spacing } = useTheme();
  const STPayload = { theme: { theme: mode, spacing } };
  const customReactSelectStyles = useMemo(
    () => ({
      control: (base) => ({
        ...base,
        backgroundColor: fieldColor(STPayload),
        height: INPUT.SELECT.HEIGHT(STPayload),
        minHeight: 'auto',
        padding: '0.2rem 0.3rem',
        border: 0,
        outline: 'none',
        cursor: 'text'
      }),
      input: (base) => ({
        ...base,
        minHeight: 'auto'
      }),
      dropdownIndicator: (base) => ({
        ...base,
        padding: 0,
        cursor: 'pointer',
        color: nodeLightTextColor(STPayload),
        '&:hover': {
          color: nodeTextColor(STPayload)
        }
      }),
      placeholder: (base) => ({
        ...base,
        color: nodeTextColor(STPayload)
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
        ...base,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        color: nodeTextColor(STPayload)
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
        wordWrap: 'break-word',
        backgroundColor: fieldColor(STPayload)
      }),
      menuList: (base) => ({
        ...base,
        // kill the white space on first and last option
        padding: 0
      }),
      group: (base) => ({
        ...base,
        backgroundColor: backgroundColor(STPayload)
      }),
      groupHeading: (base) => ({
        ...base,
        padding: '0.2rem calc(0.3rem + 2px)'
      })
    }),
    [mode, spacing]
  );

  return (
    <ReactSelect
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
      styles={customReactSelectStyles}
      {...props}
    />
  );
};

// React Hook Form wrapper around React Select
export const ControlledSelect = (props) => {
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
        <Select
          name={name}
          onBlur={onBlur}
          onChange={(option) => {
            rhfOnChange(option);
            rsOnChange(option);
          }}
          value={value}
          {...reactSelectProps}
        />
      )}
    />
  );
};