const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CreateFileWebpack = require('create-file-webpack');
const ci = require('ci-info');

const { packageInfo } = require('./util');

if (ci.isCI) {
  console.log(`Building on ${ci.name}.`);
} else {
  console.log(`Building on local with \`.env.production\`.`);
  // eslint-disable-next-line global-require
  require('dotenv').config({
    path: path.join(__dirname, '../.env.production')
  });
}

const env = 'production';

module.exports = {
  mode: env,
  context: __dirname,
  entry: {
    background: '../src/background/index.js',
    'background.app': '../src/background/app.js',
    'background.dao': '../src/background/dao.js',
    'background.storage': '../src/background/storage.js',
    'background.redirect.inject': '../src/background/redirect.inject.js',
    'background.signin.inject': '../src/background/signin.inject.js',
    'background.style.inject': '../src/background/style.inject.js',
    'content-script': '../src/content-scripts/index.js',
    popup: '../src/popup/index.js'
  },
  output: {
    filename: `[name]_${packageInfo.version}.js`,
    publicPath: '/'
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
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          outputPath: 'images'
        }
      },
      {
        test: /\.(woff|woff2)$/,
        loader: 'url-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CreateFileWebpack({
      path: path.join(__dirname, '../dist/'),
      fileName: '.version',
      content: packageInfo.version
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || env),
        VERSION: JSON.stringify(packageInfo.version),
        REACT_APP_SC_ATTR: JSON.stringify('data-styled-tomas'),
        SC_ATTR: JSON.stringify('data-styled-tomas'),
        REACT_APP_SC_DISABLE_SPEEDY: true,
        SC_DISABLE_SPEEDY: true,
        EXTENSION_ID: JSON.stringify(packageInfo.extensionId),
        ASSETS_PUBLIC_PATH: JSON.stringify(process.env.ASSETS_PUBLIC_PATH),
        WEBSITE_BASE_URL: JSON.stringify(process.env.WEBSITE_BASE_URL)
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  ],
  optimization: {
    runtimeChunk: false
  }
};
