const path = require('path');
const serverless = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const resolve = {
  extensions: ['.js', '.jsx'],
};

const config = {
  entry: serverless.lib.entries,
  mode: serverless.lib.webpack.isLocal ? 'development' : 'production',
  target: 'node',
  node: {
    __dirname: false
  },
  devtool: 'nosources-source-map',
  externals: [ nodeExternals() ],
  output: {
    libraryTarget: 'commonjs2',
    // Write to folder which serverless-webpack expects
    path: path.resolve(__dirname, '.webpack'),
    filename: '[name].js',
    strictModuleExceptionHandling: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader')
      }
    ]
  },
  resolve,
  // For serverless, everything needed must be copied to output folder
  plugins: [
    // Copy and maintain dir css
    new CopyWebpackPlugin([ { from: "css", to: "css" }, { from: "dist", to: "dist" } ]),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    })
  ]
};

// Never export multiple or 1-array entries, as serverless-webpack cannot handle those
module.exports = config;
