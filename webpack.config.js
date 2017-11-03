const path = require('path');

const entry = './src/entry.jsx';
const outputPath = path.resolve('./dist');
const publicPath = '/dist/';
const resolve = {
  extensions: ['.js', '.jsx'],
};

const clientConfig = {
  entry,
  output: {
    path: outputPath,
    filename: 'index.bundle.js',
    publicPath,
  },
  module: {
    loaders: [{
      loader: 'babel-loader',
      include: [path.resolve('./src')],
      options: {
        plugins: ['dynamic-import-webpack'],
      },
    }],
  },
  resolve,
};

const serverConfig = {
  entry,
  output: {
    path: outputPath,
    filename: 'index.server.bundle.js',
    libraryTarget: 'commonjs2',
    publicPath,
  },
  module: {
    loaders: [{
      loader: 'babel-loader',
      include: [path.resolve('./src')],
      options: {
        plugins: ['dynamic-import-node'],
      },
    }],
  },
  resolve,
};

module.exports = [
  clientConfig,
  serverConfig,
];
