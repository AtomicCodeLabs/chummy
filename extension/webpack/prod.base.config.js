const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CreateFileWebpack = require('create-file-webpack');
const ci = require('ci-info');

if (ci.isCI) {
  console.log(`Building on ${ci.name}.`);
} else {
  console.log(`Building on local with \`.env.production\`.`);
  // eslint-disable-next-line global-require
  require('dotenv').config({
    path: path.join(__dirname, '../.env.production')
  });
}

const packageInfo = JSON.parse(
  JSON.stringify(
    // eslint-disable-next-line import/no-dynamic-require
    require(path.join(__dirname, '../package.json'))
  )
);

module.exports = {
  mode: 'production',
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
    filename: `[name]_${packageInfo.version}.js`
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
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      ASSETS_PUBLIC_PATH: process.env.ASSETS_PUBLIC_PATH,
      WEBSITE_BASE_URL: process.env.WEBSITE_BASE_URL,
      WEBSITE_SIGNIN: process.env.WEBSITE_SIGNIN
    }),
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
    })
  ],
  optimization: {
    runtimeChunk: false
  }
};
