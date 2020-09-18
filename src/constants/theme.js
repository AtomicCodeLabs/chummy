import theme from 'styled-theming';

export const PRIMARY_COLOR = '#24292e';

export const DARK = '#232323';

export const LIGHT_DARK = '#2d2d2d';

export const WHITE = '#ffffff';

export const GRAY = '#888888';

export const BORDER_GRAY = '#E1E4E8';

export const backgroundColor = theme('theme', {
  light: '#ffffff',
  dark: '#24292D'
});

export const textColor = theme('theme', {
  light: '#000',
  dark: '#fff'
});

export const highlightColor = theme('theme', {
  light: '#000',
  dark: '#fff'
});

export const unHighlightColor = theme('theme', {
  light: '#888888',
  dark: '#222222'
});
