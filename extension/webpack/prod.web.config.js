const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const base = require('./prod.base.config');
const { formBaseManifest, generateReports } = require('./util');

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
    ...generateReports('prod', 'web')
  ]
};
