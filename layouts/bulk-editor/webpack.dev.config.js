const path = require('path');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
  devServer: {
    host: '0.0.0.0'
  },

  entry: './src/index.js',

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'sandbox')
        ],
        query: {
          plugins: ['transform-runtime'],
          presets: [
            ['env', {
              modules: false,
              targets: {
                browsers: ['last 2 versions', 'ie >= 11']
              }
            }], 'react', 'stage-3']
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
