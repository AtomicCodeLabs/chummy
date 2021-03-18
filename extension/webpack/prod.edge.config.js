const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const base = require('./prod.web.config');
const { formBaseManifest, generateReports } = require('./util');

module.exports = {
  ...base,
  output: {
    ...base.output,
    path: path.join(__dirname, '../dist/edge'),
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
              ...formBaseManifest(content)
              // key: 'bpobpfbpikaikajipjoaoiijnkjikpfe'
            });
          }
        }
      ]
    }),
    ...generateReports('prod', 'edge')
  ]
};
