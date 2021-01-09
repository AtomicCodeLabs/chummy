const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const base = require('./prod.base.config');
const { formBaseManifest, generateReports, packageInfo } = require('./util');

module.exports = {
  ...base,
  output: {
    ...base.output,
    path: path.join(__dirname, '../dist/gamma.moz')
  },
  plugins: [
    ...base.plugins,
    new CopyPlugin({
      patterns: [
        {
          from: '../manifest-base.json',
          to: './manifest.json',
          transform(content) {
            return JSON.stringify({
              ...formBaseManifest(content),
              browser_specific_settings: {
                gecko: {
                  id: packageInfo.email // packageInfo.extensionId
                }
              }
            });
          }
        },
        { from: '../public/icon', to: './icon' },
        { from: '../key.pem', to: './key.pem' },
        { from: '../public/index.html', to: '../index.html' }
      ]
    }),
    new HtmlWebpackPlugin({
      title: 'Chummy',
      template: '../src/popup/index.html',
      chunks: ['popup'],
      filename: 'popup.html',
      cache: false
    }),
    new HtmlWebpackPlugin({
      title: 'Chummy Background',
      template: '../src/background/index.html',
      chunks: [
        'background',
        'background.app',
        'background.dao',
        'background.storage'
      ],
      filename: 'background.html',
      cache: false
    }),
    ...generateReports('gamma', 'moz')
  ]
};
