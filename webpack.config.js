const path = require('path');
const validate = require('webpack-validator');
const webpack = require('webpack');

const isProd = (process.env.NODE_ENV === 'production');

function getPlugins() {
  const plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
      }
    })
  ];
  if (isProd) {
    // TODO: Uglify
    plugins.push(new webpack.optimize.DedupePlugin());
    plugins.push(new webpack.optimize.AggressiveMergingPlugin());
  }
  return plugins;
}

module.exports = validate({
  devtool: isProd ? 'source-map' : 'eval-source-map',
  entry: {
    other: './other.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel']
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './other.min.js',
    sourceMapFilename: "./[name].js.map"
  },
  plugins: getPlugins()
});
