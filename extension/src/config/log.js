import chalk from 'chalk';
import browser from 'webextension-polyfill';
// eslint-disable-next-line import/no-cycle
import { isProduction, getExtensionContext } from '../utils';

const logWrapper = (helper, msg, ...args) => {
  if (!isProduction()) {
    console.log('context', getExtensionContext());
    browser.extension.getBackgroundPage().console.log(helper(msg), ...args);
  }
};

// used like log.error(), log(), etc.
export default {
  log: (msg, ...args) => {
    logWrapper(chalk.gray.bgWhite, msg, ...args);
  },
  error: (msg, ...args) => {
    logWrapper(chalk.bold.red.bgRedBright, msg, ...args);
  },
  warn: (msg, ...args) => {
    logWrapper(chalk.bold.keyword('orange').bgYellowBright, msg, ...args);
  },
  debug: (msg, ...args) => {
    logWrapper(chalk.bold.magenta.bgMagentaBright, msg, ...args);
  },
  toBg: (msg, ...args) => {
    logWrapper(chalk.bold.green.bgWhite, msg, ...args);
  },
  fromBg: (msg, ...args) => {
    logWrapper(chalk.bold.blue.bgWhite, msg, ...args);
  },
  apiRead: (msg, ...args) => {
    logWrapper(chalk.bold.white.bgBlue, msg, ...args);
  },
  apiWrite: (msg, ...args) => {
    logWrapper(chalk.bold.white.bgGreen, msg, ...args);
  }
};
