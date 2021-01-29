import { ACCOUNT_TYPE, BROWSER_TYPE } from '../constants';

export const ALL_TIERS = [
  ACCOUNT_TYPE.Community,
  ACCOUNT_TYPE.Professional,
  ACCOUNT_TYPE.Enterprise
];

export const NOT_COMMUNITY = [
  ACCOUNT_TYPE.Professional,
  ACCOUNT_TYPE.Enterprise
];

export const ALL_BROWSERS = [
  BROWSER_TYPE.Chrome,
  BROWSER_TYPE.Firefox,
  BROWSER_TYPE.Edge,
  BROWSER_TYPE.Safari,
  BROWSER_TYPE.Opera,
  BROWSER_TYPE.Brave
];

export const CHROMIUM = [
  BROWSER_TYPE.Chrome,
  BROWSER_TYPE.Edge,
  BROWSER_TYPE.Opera,
  BROWSER_TYPE.Brave
];
