const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const TerserPlugin = require("terser-webpack-plugin");
const path = require('path');

const { NODE_ENV = 'development' } = process.env;

const base = {
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
    filename: '[name].js',
    chunkFilename: '[id].js',
    path: path.resolve(process.cwd(), 'dist')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: {
      path: require.resolve('path-browserify'),
      url: require.resolve('url/')
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
    // clean the build folder
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
    new HtmlWebpackPlugin({
      template: './src/options/index.html',
      chunks: ['options'],
      filename: 'options.html'
    }),
    new webpack.EnvironmentPlugin({ NODE_ENV }),
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
    new DotenvPlugin({
      path: path.join(__dirname, '../envs/.env.development')
    }),
    new BundleAnalyzerPlugin()
  ]
};

const production = {
  ...base,
  mode: 'production',
  optimization: {
    runtimeChunk: false
  },
  plugins: [
    ...base.plugins,
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new DotenvPlugin({ path: path.join(__dirname, '../envs/.env.production') }),
    new BundleAnalyzerPlugin()
  ]
};

if (NODE_ENV === 'development') {
  module.exports = development;
} else {
  module.exports = production;
}
