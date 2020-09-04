const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtensionReloaderPlugin = require('webpack-extension-reloader');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

const { NODE_ENV = 'development' } = process.env;

const base = {
  context: __dirname,
  entry: {
    background: './src/background/index.js',
    'content-script': './src/content-scripts/index.js',
    options: './src/options/index.js',
    devtools: './src/devtools/index.js',
    devpanel: './src/devtools/devpanel/index.js',
    window: './src/devtools/window/index.js'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  },
  plugins: [
    // clean the build folder
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: './src/manifest.json', to: './manifest.json' },
        { from: './src/devtools/index.html', to: './devtools.html' },
        { from: './src/devtools/index.js', to: './devtools.js' }
      ]
    }),
    new HtmlWebpackPlugin({
      template: './src/options/index.html',
      chunks: ['options'],
      filename: 'options.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/devtools/devpanel/index.html',
      chunks: ['devpanel'],
      filename: 'devpanel.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/devtools/window/index.html',
      chunks: ['window'],
      filename: 'window.html'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV)
      }
    })
  ]
};

const development = {
  ...base,
  mode: 'development',
  devtool: 'cheap-module-source-map',
  module: {
    ...base.module
  },
  plugins: [
    ...base.plugins,
    new webpack.HotModuleReplacementPlugin(),
    new ExtensionReloaderPlugin({
      manifest: path.resolve(__dirname, 'src/manifest.json')
    })
  ]
};

const production = {
  ...base,
  mode: 'production',
  devtool: '#source-map',
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    ...base.plugins,
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  ]
};

if (NODE_ENV === 'development') {
  module.exports = development;
} else {
  module.exports = production;
}
