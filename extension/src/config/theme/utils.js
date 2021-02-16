/* eslint-disable no-bitwise */
/* eslint-disable prefer-const */
/* eslint-disable no-param-reassign */

export const isThemeDark = (themeType) => themeType === 'dark';

// https://css-tricks.com/snippets/javascript/lighten-darken-color/
export const lightenDarkenColor = (col, amt) => {
  let usePound = false;
  if (col[0] === '#') {
    col = col.slice(1);
    usePound = true;
  }
  let num = parseInt(col, 16);
  let r = (num >> 16) + amt;
  if (r > 255) r = 255;
  else if (r < 0) r = 0;
  let b = ((num >> 8) & 0x00ff) + amt;
  if (b > 255) b = 255;
  else if (b < 0) b = 0;
  let g = (num & 0x0000ff) + amt;
  if (g > 255) g = 255;
  else if (g < 0) g = 0;
  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
};

// Lightens or darkens a color depending on whether theme is light or dark
export const highlightColor = (col, themeType) => {
  if (isThemeDark(themeType)) {
    return lightenDarkenColor(col, 20); // lighten
  }
  return lightenDarkenColor(col, -20); // darken
};
