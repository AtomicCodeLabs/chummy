import theme from 'styled-theming';

export const PRIMARY_COLOR = '#24292D';

export const ACCENT_COLOR = '#4078c0';

export const DARK = '#232323';

export const LIGHT_DARK = '#2d2d2d';

export const WHITE = '#ffffff';

export const BLACK = '#000000';

export const GRAY = '#888888';

export const BORDER_GRAY = '#E1E4E8';

export const backgroundColor = theme('theme', {
  light: WHITE,
  dark: PRIMARY_COLOR
});

export const backgroundAlternatingDarkColor = theme('theme', {
  light: '#F1F8FF',
  dark: DARK
});

export const backgroundAlternatingLightColor = theme('theme', {
  light: WHITE,
  dark: LIGHT_DARK
});

export const BACKGROUND_HIGHLIGHT_COLOR_LIGHT = '#d4e9ff';
export const BACKGROUND_HIGHLIGHT_COLOR_DARK = '#145596';
export const backgroundHighlightColor = theme('theme', {
  light: BACKGROUND_HIGHLIGHT_COLOR_LIGHT,
  dark: BACKGROUND_HIGHLIGHT_COLOR_DARK
});

export const BACKGROUND_HIGHLIGHT_DARK_COLOR_DARK = '#2b5387';
export const backgroundHighlightDarkColor = theme('theme', {
  light: ACCENT_COLOR,
  dark: BACKGROUND_HIGHLIGHT_DARK_COLOR_DARK
});

export const textColor = theme('theme', {
  light: BLACK,
  dark: '#fff'
});

export const NODE_TEXT_COLOR_LIGHT = '#24292e';
export const NODE_TEXT_COLOR_DARK = '#e3ded7';
export const nodeTextColor = theme('theme', {
  light: NODE_TEXT_COLOR_LIGHT,
  dark: NODE_TEXT_COLOR_DARK
});

export const invertedNodeTextColor = theme('theme', {
  light: '#e3ded7',
  dark: '#24292e'
});

export const nodeLightestTextColor = theme('theme', {
  light: '#56626e',
  dark: '#bab6b1'
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

export const FIELD_COLOR_LIGHT = '#DCDCDC';
export const FIELD_COLOR_DARK = '#56626e';
export const fieldColor = theme('theme', {
  light: FIELD_COLOR_LIGHT,
  dark: FIELD_COLOR_DARK
});
