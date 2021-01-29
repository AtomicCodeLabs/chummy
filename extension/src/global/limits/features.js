import { SETTING_TYPE, ACCOUNT_TYPE, SPACING } from '../constants.ts';

const FeatureLimits = {
  [SETTING_TYPE.Theme]: {
    [ACCOUNT_TYPE.Community]: (theme) => theme === 'vanilla-light',
    [ACCOUNT_TYPE.Professional]: () => true,
    [ACCOUNT_TYPE.Enterprise]: () => true
  },
  [SETTING_TYPE.Spacing]: {
    [ACCOUNT_TYPE.Community]: (spacing) => spacing === SPACING.Cozy,
    [ACCOUNT_TYPE.Professional]: () => true,
    [ACCOUNT_TYPE.Enterprise]: () => true
  },
  [SETTING_TYPE.StickyWindow]: {
    [ACCOUNT_TYPE.Community]: () => true,
    [ACCOUNT_TYPE.Professional]: () => true,
    [ACCOUNT_TYPE.Enterprise]: () => true
  },
  [SETTING_TYPE.SidebarSide]: {
    [ACCOUNT_TYPE.Community]: () => true,
    [ACCOUNT_TYPE.Professional]: () => true,
    [ACCOUNT_TYPE.Enterprise]: () => true
  }
};

export default FeatureLimits;
