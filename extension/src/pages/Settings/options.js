import { THEME_NAMES } from '../../config/theme/selector';
import { ALL, NOT_COMMUNITY } from '../../constants/tiers';
import { kebabify } from '../../utils';

const COMMUNITY_THEMES = ['vanilla-light'];

export const themeOptions = THEME_NAMES.map((themeName) => ({
  value: kebabify(themeName),
  label: themeName,
  tiers: COMMUNITY_THEMES.includes(kebabify(themeName)) ? ALL : NOT_COMMUNITY
}));

export const spacingOptions = [
  {
    value: 'compact',
    label: 'Compact',
    tiers: NOT_COMMUNITY
  },
  { value: 'cozy', label: 'Cozy', tiers: ALL },
  {
    value: 'comfortable',
    label: 'Comfortable',
    tiers: NOT_COMMUNITY
  }
];

export const isStickyWindowOptions = [
  { value: true, label: 'yes', tiers: NOT_COMMUNITY },
  {
    value: false,
    label: 'no',
    tiers: ALL
  }
];
