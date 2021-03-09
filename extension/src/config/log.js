import browser from 'webextension-polyfill';
// eslint-disable-next-line import/no-cycle
// import { isProduction } from '../utils';

const logWrapper = (styler, msg, ...args) => {
  // if (!isProduction()) {
  browser.extension
    .getBackgroundPage()
    .console.log(`%c${msg}`, styler, ...args);
  // }
};

// used like log.error(), log(), etc.
export default {
  log: (msg, ...args) => {
    logWrapper('color: black; background-color: white;', msg, ...args);
  },
  error: (msg, ...args) => {
    logWrapper(
      'font-weight: bold; color: #470000; background-color: #ff9494;',
      msg,
      ...args
    );
  },
  warn: (msg, ...args) => {
    logWrapper(
      'font-weight: bold; color: #523313; background-color: #ffad57;',
      msg,
      ...args
    );
  },
  debug: (msg, ...args) => {
    logWrapper(
      'font-weight: bold; color: #410e42; background-color: #fd91ff;',
      msg,
      ...args
    );
  },
  toBg: (msg, ...args) => {
    logWrapper(
      'font-weight: bold; color: #0d4f20; background-color: #96ffb4;',
      msg,
      ...args
    );
  },
  fromBg: (msg, ...args) => {
    logWrapper(
      'font-weight: bold; color: #100e5c; background-color: #aaa8f7;',
      msg,
      ...args
    );
  },
  apiRead: (msg, ...args) => {
    logWrapper(
      'font-weight: bold; color: white; background-color: #100e5c;',
      msg,
      ...args
    );
  },
  apiWrite: (msg, ...args) => {
    logWrapper(
      'font-weight: bold; color: white; background-color: #0d4f20;',
      msg,
      ...args
    );
  }
};
