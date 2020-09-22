import theme from 'styled-theming';

export const PRIMARY_COLOR = '#24292D';

export const ACCENT_COLOR = '#4078c0';

export const DARK = '#232323';

export const LIGHT_DARK = '#2d2d2d';

export const WHITE = '#ffffff';

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

export const backgroundHighlightColor = theme('theme', {
  light: '#d4e9ff',
  dark: '#145596'
});

export const textColor = theme('theme', {
  light: '#000',
  dark: '#fff'
});

export const nodeTextColor = theme('theme', {
  light: '#24292e',
  dark: '#e3ded7'
});

export const folderIconColor = theme('theme', {
  light: '#79b8ff',
  dark: '#79b8ff'
});

export const nodeIconColor = theme('theme', {
  light: '#6a737d',
  dark: '#e3ded7'
});

export const highlightColor = theme('theme', {
  light: '#000',
  dark: '#fff'
});

export const unHighlightColor = theme('theme', {
  light: '#888888',
  dark: '#222222'
});

export const shadowColor = theme('theme', {
  light: 'rgba(0, 0, 0, 0.1)',
  dark: 'rgba(0, 0, 0, 0.5)'
});
