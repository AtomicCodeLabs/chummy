import Bowser from 'bowser';
import { CHROMIUM } from '../global/limits/constants.ts';

// eslint-disable-next-line import/prefer-default-export
export const browserName = Bowser.getParser(window.navigator.userAgent)
  .getBrowser()
  .name.toLowerCase();

export const isChromium = CHROMIUM.includes(browserName);
