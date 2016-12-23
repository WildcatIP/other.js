const CopyWebpackPlugin = require('copy-webpack-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

const isProd = process.env.NODE_ENV === 'production'
const version = require('./package.json').version + '+' + new GitRevisionPlugin().version()

function getPlugins() {
  const plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      },
    }),
    new CopyWebpackPlugin([
      {from: 'builtins/*.other.js'},
      {from: 'examples/*.other.js'},
    ]),
  ]
  if (isProd) {
    plugins.push(new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }))
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      compress: {warnings: false},
      sourceMap: true,
      // TODO: Mangling reduces bundle size by 20%, but breaks things.
      // Need to figure out the right set of exceptions.
      // mangle: {props: true}
    }))
    plugins.push(new webpack.optimize.AggressiveMergingPlugin())
  }
  return plugins
}

module.exports = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    https: true,
    historyApiFallback: {
      rewrites: [
        {from: /^\/otherjs\/[0-9x~.]+\/other.min.js$/, to: `/otherjs/${version}/other.min.js`},
      ],
    },
  },
  devtool: isProd ? 'source-map' : 'eval-source-map',
  entry: {
    embedder: './embedder.js',
    other: './index.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  output: {
    filename: `./otherjs/${version}/[name].min.js`,
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'dist'),
    sourceMapFilename: `./otherjs/${version}/[name].js.map`,
  },
  resolve: {
    alias: {
      'node-fetch': 'whatwg-fetch',
    },
  },
  plugins: getPlugins(),
}
