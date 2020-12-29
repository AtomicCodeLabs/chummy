const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const AssetsPlugin = require('assets-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

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
    path: path.join(__dirname, '../dist/web'),
    publicPath: '/'
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
              key:
                'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkZ7eURkxU+9PPkvVaVDUK88dZX39ZXKS9zRtpkAY6so1omoDZ6L3AWjy4e3ds8vz6OxeFcPzgycgTDVaPa2LAgvk2i+/eSbmFO8wvbp8Ce0/iPf2Vp0IqR1MQ+aRT+qD+6swNXvIJuAwFcuPP0LnDMe4veGVHyvI4uoelEVJ7P7RrnrskU4vscUAKHi5FygZLnfXzifrY2Vy6GA2wNipmd2I4+gW4ZnvSTzMs1u6s/k3LSg96cFxOl62AanEnuOcahUrCPl2/aTlU8OrOdgyiGvWKw4DxXsLC7XNZ589QvVP9uRdSsj7sAie/bGkTWRM3/NqYts8YhsMypWCCCxnQQIDAQAB'
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
      publicPath: `${process.env.ASSETS_PUBLIC_PATH}/${packageInfo.version}`,
      filename: 'popup.html',
      cache: false
    }),
    new HtmlWebpackPlugin({
      title: 'Chummy Background',
      template: '../src/background/index.html',
      chunks: ['background', 'background.app', 'background.storage'],
      filename: 'background.html',
      cache: false
    }),
    new HtmlWebpackTagsPlugin({
      scripts: [`background.dao_${packageInfo.version}.js`],
      publicPath: `${process.env.ASSETS_PUBLIC_PATH}/${packageInfo.version}`,
      append: true
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
