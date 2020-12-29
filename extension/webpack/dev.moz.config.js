const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyPlugin = require('copy-webpack-plugin');

const base = require('./dev.base.config');
const { formBaseManifest } = require('./util');

const packageInfo = JSON.parse(
  JSON.stringify(
    // eslint-disable-next-line import/no-dynamic-require
    require(path.join(__dirname, '../package.json'))
  )
);

module.exports = {
  ...base,
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
        { from: '../public/icon', to: './icon' }
      ]
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: path.join(__dirname, './reports/report.dev.moz.html'),
      statsFilename: path.join(__dirname, './reports/stats.dev.moz.json'),
      generateStatsFile: true,
      openAnalyzer: false
    })
  ]
};
