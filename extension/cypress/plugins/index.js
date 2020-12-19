const path = require('path');
const extensionLoader = require('cypress-browser-extension-plugin/loader');

/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

const sourceDir = path.join(__dirname, '../../dist/', process.env.TARGET);

module.exports = (on) => {
  on('before:browser:launch', async (browser = {}, launchOptions) => {
    const loader = extensionLoader.load({
      source: sourceDir,
      alias: 'chummy'
    });

    const args = await loader(browser, []);
    launchOptions.args.push(...args);

    return launchOptions;
  });
};
