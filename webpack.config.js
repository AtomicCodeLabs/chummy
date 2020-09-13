const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtensionReloaderPlugin = require('webpack-extension-reloader');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const path = require('path');

const { NODE_ENV = 'development' } = process.env;

const base = {
  context: __dirname,
  entry: {
    background: './src/background/index.js',
    'background.firebase': './src/background/firebase.js',
    'background.storage': './src/background/storage.js',
    'content-script': './src/content-scripts/index.js',
    options: './src/options/index.js',
    devtools: './src/devtools/index.js',
    devpanel: './src/devtools/devpanel/index.js',
    window: './src/devtools/window/index.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
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
        test: /\.svg$/,
        use: '@svgr/webpack'
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
    // clean the build folder
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: './src/manifest.json', to: './manifest.json' },
        {
          from: './src/content-scripts/index.css',
          to: './content-script.css'
        },
        { from: './public/icon', to: './icon' }
      ]
    }),
    new HtmlWebpackPlugin({
      template: './src/options/index.html',
      chunks: ['options'],
      filename: 'options.html'
    }),
    // new HtmlWebpackPlugin({
    //   template: './src/devtools/devpanel/index.html',
    //   chunks: ['devpanel'],
    //   filename: 'devpanel.html'
    // }),
    // new HtmlWebpackPlugin({
    //   template: './src/devtools/window/index.html',
    //   chunks: ['window'],
    //   filename: 'window.html'
    // }),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.DefinePlugin({
      'process.env': {
        REACT_APP_SC_ATTR: JSON.stringify('data-styled-tomas'),
        SC_ATTR: JSON.stringify('data-styled-tomas'),
        REACT_APP_SC_DISABLE_SPEEDY: true,
        SC_DISABLE_SPEEDY: true
      }
    })
  ]
};

const development = {
  ...base,
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    ...base.module
  },
  plugins: [
    ...base.plugins,
    new webpack.HotModuleReplacementPlugin(),
    new ExtensionReloaderPlugin({
      manifest: path.resolve(__dirname, 'src/manifest.json')
    }),
    new DotenvPlugin({ path: path.resolve(__dirname, '.env.development') })
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
