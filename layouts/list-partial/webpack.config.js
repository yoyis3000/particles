const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'src')
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

  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin()
  ],

  output: {
    path: path.resolve(''),
    filename: 'index.js',
    libraryTarget: 'umd'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
    alias: {
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom')
    }
  },

  externals: {
    react: 'umd react',
    'react-dom': 'umd react-dom'
  }
};
