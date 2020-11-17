import theme from 'styled-theming';
import selector from '../config/theme/selector';

// Sizing

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

export const h3FontSize = theme('spacing', {
  compact: '0.8rem',
  cozy: '0.83rem',
  comfortable: '0.86rem'
});

export const h2FontSize = theme('spacing', {
  compact: '1rem',
  cozy: '1.2rem',
  comfortable: '1.3rem'
});

export const h1FontSize = theme('spacing', {
  compact: '1.3rem',
  cozy: '1.5rem',
  comfortable: '1.7rem'
});

export const textSpacing = theme('spacing', {
  compact: '0.47rem',
  cozy: '0.5rem',
  comfortable: '0.55rem'
});

export const lineHeight = theme('spacing', {
  compact: '1.1rem',
  cozy: '1.2rem',
  comfortable: '1.3rem'
});

// Colors

const themeCreator = (key) => theme('theme', selector(key));

export const sidebarColor = themeCreator('sidebarColor');
export const sidebarActiveIconColor = themeCreator('sidebarActiveIconColor');
export const sidebarInactiveIconColor = themeCreator(
  'sidebarInactiveIconColor'
);
export const backgroundColor = themeCreator('backgroundColor');
export const backgroundAlternatingDarkColor = themeCreator(
  'backgroundAlternatingDarkColor'
);
export const backgroundAlternatingLightColor = themeCreator(
  'backgroundAlternatingLightColor'
);
export const backgroundHighlightColor = themeCreator(
  'backgroundHighlightColor'
);
export const backgroundHighlightTextColor = themeCreator(
  'backgroundHighlightTextColor'
);
export const backgroundHighlightDarkColor = themeCreator(
  'backgroundHighlightDarkColor'
);
export const backgroundHighlightDarkTextColor = themeCreator(
  'backgroundHighlightDarkTextColor'
);
export const textColor = themeCreator('textColor');
export const lightTextColor = themeCreator('lightTextColor');
export const lighterTextColor = themeCreator('lighterTextColor');
export const lightBackgroundTextColor = themeCreator(
  'lightBackgroundTextColor'
);
export const darkBackgroundTextColor = themeCreator('darkBackgroundTextColor');
export const highlightTextColor = themeCreator('highlightTextColor');
export const highlightBackgroundColor = themeCreator(
  'highlightBackgroundColor'
);
export const folderIconColor = themeCreator('folderIconColor');
export const bookmarkIconColor = themeCreator('bookmarkIconColor');
export const nodeIconColor = themeCreator('nodeIconColor');
export const nodeIconDarkColor = themeCreator('nodeIconDarkColor');
export const shadowColor = themeCreator('shadowColor');
export const fieldBackgroundColor = themeCreator('fieldBackgroundColor');
export const fieldBackgroundLightColor = themeCreator(
  'fieldBackgroundLightColor'
);
export const fieldFocusOutlineColor = themeCreator('fieldFocusOutlineColor');
export const borderColor = themeCreator('borderColor');
