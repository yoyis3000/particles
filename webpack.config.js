const path = require('path');

const { mergeDeep } = require('./shared/mergeDeep');

const prodConfig = (dir, options = {}) => {
  const common = {
    entry: './src/index.js',

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          include: [
            path.resolve(dir, 'src')
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

  return mergeDeep(common, options);
};

module.exports = prodConfig;
