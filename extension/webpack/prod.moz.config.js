const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const AssetsPlugin = require('assets-webpack-plugin');

const base = require('./prod.base.config');
const { formBaseManifest } = require('./util');

const packageInfo = JSON.parse(
  JSON.stringify(
    // eslint-disable-next-line import/no-dynamic-require
    require(path.join(__dirname, '../package.json'))
  )
);

module.exports = {
  ...base,
  output: {
    ...base.output,
    path: path.join(__dirname, '../dist/moz')
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
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: path.join(__dirname, './reports/report.prod.moz.html'),
      statsFilename: path.join(__dirname, './reports/stats.prod.moz.json'),
      generateStatsFile: true,
      openAnalyzer: false
    }),
    new AssetsPlugin({
      filename: 'assets.prod.moz.json',
      path: path.join(__dirname, './reports')
    })
  ]
};
