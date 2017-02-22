module.exports = {
  entry: ['./src/index.js'],

  module: {
    loaders: [
      {
        loader: 'babel-loader',
        include: [
          __dirname + '/src',
          __dirname + '/sandbox'
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
  },
};
