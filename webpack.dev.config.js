const path = require('path');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const { mergeDeep } = require('./shared/mergeDeep');

const devConfig = (dir, options = {}) => {
  const common = {
    entry: './src/index.js',

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          include: [
            path.resolve(dir, 'src'),
            path.resolve(dir, 'sandbox')
          ],
          query: {
            plugins: ['transform-decorators-legacy', 'transform-runtime'],
            presets: ['latest', 'react', 'stage-0']
          }
        },
        {
          test: /\.s?[ca]ss$/,
          exclude: /node_modules/,
          use: [{
            loader: 'style-loader'
          }, {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[local]__[path][name]__[hash:base64:5]'
            }
          }, {
            loader: 'autoprefixer-loader',
            options: {
              browsers: 'last 2 versions'
            }
          }, {
            loader: 'sass-loader'
          }]
        },
        {
          test: /\.svg$/,
          loader: 'file-loader'
        }
      ]
    },

    output: {
      path: path.resolve(''),
      filename: 'index.js',
      libraryTarget: 'umd'
    },

    plugins: [
      new FriendlyErrorsWebpackPlugin(),
      new WebpackNotifierPlugin({ alwaysNotify: false })
    ],

    resolve: {
      extensions: ['.js', '.jsx', '.scss']
    }
  };

  return mergeDeep(common, options);
};

module.exports = devConfig;
