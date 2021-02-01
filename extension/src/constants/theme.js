import { css } from 'styled-components';
import theme from 'styled-theming';

import selector from '../config/theme/selector';
import { isThemeDark } from '../config/theme/utils';
import { BLACK, WHITE } from './colors';
import { NotificationType } from '../config/store/I.ui.store';

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

export const smallestFontSize = theme('spacing', {
  compact: '0.4rem',
  cozy: '0.4rem',
  comfortable: '0.4rem'
});

export const smallFontSize = theme('spacing', {
  compact: '0.68rem',
  cozy: '0.7rem',
  comfortable: '0.75rem'
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
export const h3MarginSize = theme('spacing', {
  compact: '0.4rem',
  cozy: '0.415rem',
  comfortable: '0.43rem'
});

export const h2FontSize = theme('spacing', {
  compact: '1rem',
  cozy: '1.2rem',
  comfortable: '1.3rem'
});

export const h2MarginSize = theme('spacing', {
  compact: '0.5rem',
  cozy: '0.6rem',
  comfortable: '0.65rem'
});

export const h1FontSize = theme('spacing', {
  compact: '1.3rem',
  cozy: '1.5rem',
  comfortable: '1.7rem'
});

export const h1MarginSize = theme('spacing', {
  compact: '0.8rem',
  cozy: '1rem',
  comfortable: '1.3rem'
});

export const titleFontSize = theme('spacing', {
  compact: '1.6rem',
  cozy: '1.8rem',
  comfortable: '1.9rem'
});

export const titleMarginSize = theme('spacing', {
  compact: '0.8rem auto 0.4rem auto',
  cozy: '1rem auto 0.5rem auto',
  comfortable: '1.3rem auto 0.65rem auto'
});

export const subTitleFontSize = theme('spacing', {
  compact: '0.9rem',
  cozy: '1.1rem',
  comfortable: '1.2rem'
});

export const subTitleMarginSize = theme('spacing', {
  compact: '0.35rem',
  cozy: '0.4rem',
  comfortable: '0.4rem'
});

export const monoFontSize = theme('spacing', {
  compact: '0.72rem',
  cozy: '0.75rem',
  comfortable: '0.80rem'
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

export const spacerSpacing = theme('spacing', {
  compact: '0.8rem',
  cozy: '0.9rem',
  comfortable: '0.9rem'
});

export const labelMargin = theme('spacing', {
  compact: css`
    margin-top: 0.18rem;
    margin-bottom: 0.1rem;
  `,
  cozy: css`
    margin-top: 0.2rem;
    margin-bottom: 0.12rem;
  `,
  comfortable: css`
    margin-top: 0.4rem;
    margin-bottom: 0.2rem;
  `
});

// Colors

const themeCreator = (key) => theme('theme', selector(key));

export const themeType = themeCreator('type');
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
export const flagIconColor = themeCreator('flagIconColor');
export const bookmarkIconColor = themeCreator('bookmarkIconColor');
export const nodeIconColor = themeCreator('nodeIconColor');
export const nodeIconDarkColor = themeCreator('nodeIconDarkColor');
export const shadowColor = themeCreator('shadowColor');
export const fieldBackgroundColor = themeCreator('fieldBackgroundColor');
export const fieldBackgroundLightColor = themeCreator(
  'fieldBackgroundLightColor'
);
export const fieldFocusOutlineColor = themeCreator('fieldFocusOutlineColor');
export const optionDisabledBackgroundColor = themeCreator(
  'optionDisabledBackgroundColor'
);
export const optionDisabledTextColor = themeCreator('optionDisabledTextColor');
export const borderColor = themeCreator('borderColor');
export const successColor = themeCreator('successColor');
export const errorColor = themeCreator('errorColor');
export const infoColor = themeCreator('infoColor');
export const warningColor = themeCreator('warningColor');

// Constants that don't change with theme but only with theme type
export const contrastTextColor = (props) => {
  return isThemeDark(themeType(props)) ? BLACK : WHITE;
};

export const notificationTypeToColor = {
  [NotificationType.Success]: successColor,
  [NotificationType.Error]: errorColor,
  [NotificationType.Warning]: warningColor,
  [NotificationType.Info]: infoColor
};
