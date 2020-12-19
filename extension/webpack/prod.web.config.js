const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackDynamicPublicPathPlugin = require('webpack-dynamic-public-path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const AssetsPlugin = require('assets-webpack-plugin');

const base = require('./prod.base.config');

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
    path: path.join(__dirname, '../dist/web')
  },
  plugins: [
    ...base.plugins,
    new CopyPlugin({
      patterns: [
        {
          from: '../manifest-base.json',
          to: './manifest.json',
          transform(content) {
            return JSON.stringify(
              {
                ...JSON.parse(content),
                description: packageInfo.description,
                version: packageInfo.version
              },
              null,
              2
            );
          }
        },
        { from: '../public/icon', to: './icon' },
        { from: '../src/background/index.prod.html', to: './background.html' },
        { from: '../key.pem', to: './key.pem' }
      ]
    }),
    new HtmlWebpackPlugin({
      title: 'Chummy',
      template: '../src/popup/index.html',
      chunks: ['popup'],
      publicPath: process.env.ASSETS_PUBLIC_PATH,
      filename: 'popup.html',
      cache: false
    }),
    new WebpackDynamicPublicPathPlugin({
      externalPublicPath: `"${process.env.ASSETS_PUBLIC_PATH}"`,
      chunkNames: ['background.firebase', 'popup']
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: path.join(__dirname, './reports/report.prod.web.html'),
      statsFilename: path.join(__dirname, './reports/stats.prod.web.json'),
      generateStatsFile: true,
      openAnalyzer: false
    }),
    new AssetsPlugin({
      filename: 'assets.prod.web.json',
      path: path.join(__dirname, './reports')
    })
  ]
};
