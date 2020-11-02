import theme from 'styled-theming';

import {
  PRIMARY_COLOR,
  ACCENT_COLOR,
  DARK,
  LIGHT_DARK,
  WHITE,
  BLACK,
  BACKGROUND_HIGHLIGHT_COLOR_DARK,
  BACKGROUND_HIGHLIGHT_COLOR_LIGHT,
  BACKGROUND_HIGHLIGHT_DARK_COLOR_DARK,
  NODE_LIGHTEST_TEXT_COLOR_DARK,
  NODE_LIGHTEST_TEXT_COLOR_LIGHT,
  NODE_TEXT_COLOR_DARK,
  NODE_TEXT_COLOR_LIGHT,
  FIELD_COLOR_DARK,
  FIELD_COLOR_LIGHT
} from './colors';

export const fieldMargin = theme('spacing', {
  compact: 3,
  cozy: 5,
  comfortable: 6
});

export const indentPadding = theme('spacing', {
  compact: '1.3rem',
  cozy: '1.6rem',
  comfortable: '1.8rem'
});

export const fontSize = theme('spacing', {
  compact: '0.75rem',
  cozy: '0.8rem',
  comfortable: '0.83rem'
});

export const textSpacing = theme('spacing', {
  compact: '0.35rem',
  cozy: '0.5rem',
  comfortable: '0.55rem'
});

export const lineHeight = theme('spacing', {
  compact: '0.9rem',
  cozy: '1.2rem',
  comfortable: '1.3rem'
});

export const sideBarColor = theme('theme', {
  light: PRIMARY_COLOR,
  dark: FIELD_COLOR_DARK
});

export const backgroundColor = theme('theme', {
  light: WHITE,
  dark: DARK
});

export const backgroundAlternatingDarkColor = theme('theme', {
  light: '#F1F8FF',
  dark: DARK
});

export const backgroundAlternatingLightColor = theme('theme', {
  light: WHITE,
  dark: LIGHT_DARK
});

export const backgroundHighlightColor = theme('theme', {
  light: BACKGROUND_HIGHLIGHT_COLOR_LIGHT,
  dark: BACKGROUND_HIGHLIGHT_DARK_COLOR_DARK
});

export const backgroundHighlightDarkColor = theme('theme', {
  light: ACCENT_COLOR,
  dark: BACKGROUND_HIGHLIGHT_COLOR_DARK
});

export const textColor = theme('theme', {
  light: BLACK,
  dark: '#fff'
});

export const nodeTextColor = theme('theme', {
  light: NODE_TEXT_COLOR_LIGHT,
  dark: NODE_TEXT_COLOR_DARK
});

export const nodeLightTextColor = theme('theme', {
  light: NODE_LIGHTEST_TEXT_COLOR_LIGHT,
  dark: NODE_LIGHTEST_TEXT_COLOR_DARK
});

export const invertedNodeTextColor = theme('theme', {
  light: '#e3ded7',
  dark: '#e3ded7'
});

export const textHighlightColor = theme('theme', {
  light: '#fff200',
  dark: '#fff200'
});

export const folderIconColor = theme('theme', {
  light: '#79b8ff',
  dark: '#79b8ff'
});

export const nodeIconColor = theme('theme', {
  light: '#6a737d',
  dark: '#e3ded7'
});

export const nodeIconDarkerColor = theme('theme', {
  light: '#4b5259',
  dark: '#f2eee9'
});

export const highlightColor = theme('theme', {
  light: BLACK,
  dark: WHITE
});

export const unHighlightColor = theme('theme', {
  light: '#888888',
  dark: '#222222'
});

export const shadowColor = theme('theme', {
  light: 'rgba(0, 0, 0, 0.1)',
  dark: 'rgba(0, 0, 0, 0.5)'
});

export const fieldColor = theme('theme', {
  light: FIELD_COLOR_LIGHT,
  dark: FIELD_COLOR_DARK
});
