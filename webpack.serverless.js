const path = require('path');
const serverless = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals')

const entry = './src/entry.jsx';
const resolve = {
  extensions: ['.js', '.jsx'],
};

console.log(serverless.lib.entries);

const config = {
  entry: serverless.lib.entries,
  mode: serverless.lib.webpack.isLocal ? 'development' : 'production',
  target: 'node',
  externals: [ nodeExternals() ],
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '.webpack/service'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' },
        ]
      }
    ]
  },
  resolve
};

module.exports = [
  config
];
