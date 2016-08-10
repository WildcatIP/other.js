const CopyWebpackPlugin = require('copy-webpack-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const path = require('path')
const validate = require('webpack-validator').validateRoot
const webpack = require('webpack')

const isProd = (process.env.NODE_ENV === 'production')
const version = require('./package.json').version + '+' + new GitRevisionPlugin().version()

function getPlugins() {
  const plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
      }
    }),
    new CopyWebpackPlugin([
      {from: 'examples', to: 'examples'}
    ])
  ]
  if (isProd) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      compress: {warnings: false}
      // TODO: Mangling reduces bundle size by 20%, but breaks things.
      // Need to figure out the right set of exceptions.
      // mangle: {props: true}
    }))
    plugins.push(new webpack.optimize.DedupePlugin())
    plugins.push(new webpack.optimize.AggressiveMergingPlugin())
  }
  return plugins
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
    filename: `./otherjs/${version}/[name].min.js`,
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'dist'),
    sourceMapFilename: `./otherjs/${version}/[name].js.map`
  },
  plugins: getPlugins()
})
