import { THEME_NAMES } from '../../config/theme/selector';
import { kebabify } from '../../utils';

export const themeOptions = THEME_NAMES.map((themeName) => ({
  value: kebabify(themeName),
  label: themeName
}));

export const spacingOptions = [
  { value: 'compact', label: 'Compact' },
  { value: 'cozy', label: 'Cozy' },
  { value: 'comfortable', label: 'Comfortable' }
];

export const isStickyWindowOptions = [
  { value: true, label: 'yes' },
  { value: false, label: 'no' }
];
