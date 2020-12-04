const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path');

const env =
  process.env && process.env.NODE_ENV.trim() === 'production'
    ? 'production'
    : 'development';

module.exports = {
  mode: env,
  devtool: 'inline-source-map',
  context: __dirname,
  entry: {
    background: './src/background/index.js',
    'background.app': './src/background/app.js',
    'background.firebase': './src/background/firebase.js',
    'background.storage': './src/background/storage.js',
    'background.redirect.inject': './src/background/redirect.inject.js',
    'content-script': './src/content-scripts/index.js',
    popup: './src/popup/index.js',
    options: './src/options/index.js'
  },
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[name].js',
    chunkFilename: '[name][id].js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: {
      path: require.resolve('path-browserify'),
      url: require.resolve('url/')
    }
  },
  devServer: {
    contentBase: path.resolve(process.cwd(), 'dist'),
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
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
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
        { from: './src/manifest.json', to: './manifest.json' }, // {
        { from: './public/icon', to: './icon' }
      ]
    }),
    new HtmlWebpackPlugin({
      template: './src/popup/index.html',
      chunks: ['popup'],
      filename: 'popup.html',
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
      path: path.join(__dirname, '.env.development')
    }),
    new MiniCssExtractPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: path.join(__dirname, './reports/report.dev.html'),
      statsFilename: path.join(__dirname, './reports/stats.dev.json'),
      generateStatsFile: true
    })
  ]
};
