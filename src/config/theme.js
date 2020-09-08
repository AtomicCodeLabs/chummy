import theme from 'styled-theming';

export const backgroundColor = theme('mode', {
  light: '#ffffff',
  dark: '#f6f8fa'
});

export const textColor = theme('mode', {
  light: '#000000',
  dark: '#ffffff'
});
