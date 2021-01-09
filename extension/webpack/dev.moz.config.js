const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const base = require('./dev.base.config');
const { formBaseManifest, generateReports, packageInfo } = require('./util');

module.exports = {
  ...base,
  output: {
    ...base.outputs,
    path: path.join(__dirname, '../dist/dev.moz')
  },
  plugins: [
    ...base.plugins,
    new CopyPlugin({
      patterns: [
        {
          from: '../manifest-base.json',
          to: './manifest.json',
          transform(content) {
            const baseManifest = formBaseManifest(content);
            return JSON.stringify({
              ...baseManifest,
              browser_specific_settings: {
                gecko: {
                  id: packageInfo.email // packageInfo.extensionId
                }
              },
              permissions: [
                ...baseManifest.permissions.slice(0, -1),
                'http://localhost/*' // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns
              ]
            });
          }
        },
        { from: '../public/icon', to: './icon' }
      ]
    }),
    ...generateReports('dev', 'moz')
  ]
};
