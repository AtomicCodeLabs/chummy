const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');

require('dotenv').config({
  path: path.join(__dirname, '../.env.production')
});

const packageInfo = JSON.parse(
  JSON.stringify(
    // eslint-disable-next-line import/no-dynamic-require
    require(path.join(__dirname, '../package.json'))
  )
);

const env =
  process.env && process.env.NODE_ENV.trim() === 'production'
    ? 'production'
    : 'development';

module.exports = {
  mode: env,
  context: __dirname,
  entry: {
    background: '../src/background/index.js',
    'background.app': '../src/background/app.js',
    'background.firebase': '../src/background/firebase.js',
    'background.storage': '../src/background/storage.js',
    'background.redirect.inject': '../src/background/redirect.inject.js',
    'content-script': '../src/content-scripts/index.js',
    popup: '../src/popup/index.js'
  },
  output: {
    filename: `[name]_${packageInfo.version}.js`
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: {
      path: require.resolve('path-browserify'),
      url: require.resolve('url/')
    }
  },
  devServer: {
    contentBase: path.join(__dirname, '../dist/moz'),
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
    new webpack.EnvironmentPlugin({ NODE_ENV: env }),
    new webpack.DefinePlugin({
      'process.env': {
        REACT_APP_SC_ATTR: JSON.stringify('data-styled-tomas'),
        SC_ATTR: JSON.stringify('data-styled-tomas'),
        REACT_APP_SC_DISABLE_SPEEDY: true,
        SC_DISABLE_SPEEDY: true
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new DotenvPlugin({ path: path.join(__dirname, '../.env.production') })
  ],
  optimization: {
    runtimeChunk: false
  }
};
