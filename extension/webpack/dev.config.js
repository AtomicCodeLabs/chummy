const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const DotenvPlugin = require('dotenv-webpack');
const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, '../.env.development')
});

const packageInfo = JSON.parse(
  JSON.stringify(
    // eslint-disable-next-line import/no-dynamic-require
    require(path.join(__dirname, '../package.json'))
  )
);

const env = 'development';

module.exports = {
  mode: env,
  devtool: 'inline-source-map',
  context: __dirname,
  entry: {
    background: '../src/background/index.js',
    'background.app': '../src/background/app.js',
    'background.dao': '../src/background/dao.js',
    'background.storage': '../src/background/storage.js',
    'background.redirect.inject': '../src/background/redirect.inject.js',
    'content-script': '../src/content-scripts/index.js',
    popup: '../src/popup/index.js'
  },
  output: {
    path: path.join(__dirname, '../dist/dev'),
    filename: '[name].js',
    chunkFilename: '[name][id].js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.css'],
    fallback: {
      path: require.resolve('path-browserify'),
      url: require.resolve('url/'),
      crypto: false,
      stream: false
    }
  },
  devServer: {
    contentBase: path.join(__dirname, '../dist/dev'),
    compress: true,
    port: 8080,
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      { test: /\.css$/, use: 'css-loader' },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          outputPath: 'images'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
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
                version: packageInfo.version,
                key:
                  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkZ7eURkxU+9PPkvVaVDUK88dZX39ZXKS9zRtpkAY6so1omoDZ6L3AWjy4e3ds8vz6OxeFcPzgycgTDVaPa2LAgvk2i+/eSbmFO8wvbp8Ce0/iPf2Vp0IqR1MQ+aRT+qD+6swNXvIJuAwFcuPP0LnDMe4veGVHyvI4uoelEVJ7P7RrnrskU4vscUAKHi5FygZLnfXzifrY2Vy6GA2wNipmd2I4+gW4ZnvSTzMs1u6s/k3LSg96cFxOl62AanEnuOcahUrCPl2/aTlU8OrOdgyiGvWKw4DxXsLC7XNZ589QvVP9uRdSsj7sAie/bGkTWRM3/NqYts8YhsMypWCCCxnQQIDAQAB',
                externally_connectable: {
                  matches: ['http://localhost:8000/account']
                }
              },
              null,
              2
            );
          }
        },
        { from: '../public/icon', to: './icon' }
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
    new webpack.EnvironmentPlugin({ NODE_ENV: env }),
    new webpack.DefinePlugin({
      'process.env': {
        REACT_APP_SC_ATTR: JSON.stringify('data-styled-tomas'),
        SC_ATTR: JSON.stringify('data-styled-tomas'),
        REACT_APP_SC_DISABLE_SPEEDY: true,
        SC_DISABLE_SPEEDY: true
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new DotenvPlugin({
      path: path.join(__dirname, '../.env.development')
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: path.join(__dirname, './reports/report.dev.html'),
      statsFilename: path.join(__dirname, './reports/stats.dev.json'),
      generateStatsFile: true,
      openAnalyzer: false
    })
  ]
};
