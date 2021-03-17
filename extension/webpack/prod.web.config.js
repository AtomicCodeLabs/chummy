const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const base = require('./prod.base.config');

module.exports = {
  ...base,
  plugins: [
    ...base.plugins,
    new CopyPlugin({
      patterns: [
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
    })
  ]
};
