const config = require('../../webpack.config');
const webpack = require('webpack');

module.exports = config(__dirname, {
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
});
