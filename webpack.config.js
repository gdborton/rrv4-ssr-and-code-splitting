const path = require('path');

const entry = './src/entry.tsx';

const outputPath = path.resolve('./dist');
const publicPath = '/dist/';
const resolve = {
  extensions: ['.ts', '.tsx', '.js', '.json', '.jsx', '.css', 'scss'],
  modules: ['node_modules'],
};

const clientConfig = {
  entry,
  mode:'development',
  output: {
    path: outputPath,
    filename: 'index.bundle.js',
    publicPath,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'awesome-typescript-loader'
          }
        ]
      }
    ],
  },
  resolve,
};

const serverConfig = {
  entry,
  mode:'development',
  output: {
    path: outputPath,
    filename: 'index.server.bundle.js',
    libraryTarget: 'commonjs2',
    publicPath,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'awesome-typescript-loader'
          }
        ]
      }
    ],
  },
  resolve,
};

module.exports = [
  clientConfig,
  serverConfig,
];
