import { THEME_NAMES } from '../../config/theme/selector';
import { SIDEBAR_SIDE } from '../../global/constants.ts';
import {
  ALL_TIERS,
  NOT_COMMUNITY,
  ALL_BROWSERS,
  CHROMIUM
} from '../../global/limits/constants.ts';
import { kebabify } from '../../utils';

const COMMUNITY_THEMES = ['vanilla-light'];

export const themeConfig = {
  browsers: ALL_BROWSERS,
  options: THEME_NAMES.map((themeName) => ({
    value: kebabify(themeName),
    label: themeName,
    tiers: COMMUNITY_THEMES.includes(kebabify(themeName))
      ? ALL_TIERS
      : NOT_COMMUNITY
  }))
};

export const spacingConfig = {
  browsers: ALL_BROWSERS,
  options: [
    {
      value: 'compact',
      label: 'Compact',
      tiers: NOT_COMMUNITY,
      browsers: ALL_BROWSERS
    },
    { value: 'cozy', label: 'Cozy', tiers: ALL_TIERS, browsers: ALL_BROWSERS },
    {
      value: 'comfortable',
      label: 'Comfortable',
      tiers: NOT_COMMUNITY,
      browsers: ALL_BROWSERS
    }
  ]
};

export const isStickyWindowConfig = {
  browsers: CHROMIUM,
  options: [
    { value: true, label: 'Yes', tiers: NOT_COMMUNITY },
    {
      value: false,
      label: 'No',
      tiers: ALL_TIERS
    }
  ]
};

export const sidebarSideConfig = {
  browsers: ALL_BROWSERS,
  options: [
    { value: SIDEBAR_SIDE.Left, label: 'Left', tiers: ALL_TIERS },
    {
      value: SIDEBAR_SIDE.Right,
      label: 'Right',
      tiers: NOT_COMMUNITY
    }
  ]
};
