var path = require('path');

module.exports = {
  entry: ['./src/index.js'],

  module: {
    loaders: [
      {
        loader: 'babel-loader',
        include: [
          __dirname + '/src',
        ],
        test: /\.jsx?$/,
        query: {
          plugins: ['transform-decorators-legacy', 'transform-runtime'],
          presets: ['latest', 'react', 'stage-0'],
        },
      },
    ],
  },

  output: {
    path: './',
    filename: 'index.js',
    libraryTarget: 'umd',
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },

  externals: {
    react: 'umd react',
    'react-dom': 'umd react-dom',
  },
};
