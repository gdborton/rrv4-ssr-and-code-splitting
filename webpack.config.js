const path = require('path');

const entry = './src/entry.jsx';
const outputPath = path.resolve('./dist');
const publicPath = '/dist/';
const resolve = {
  extensions: ['.js', '.jsx'],
};

const clientConfig = {
  entry,
  mode: process.env.NODE_ENV == "production" ? "production" : "development",
  output: {
    path: outputPath,
    filename: 'index.bundle.js',
    publicPath,
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

const serverConfig = {
  entry,
  target: 'node',
  mode: process.env.NODE_ENV == "production" ? "production" : "development",
  output: {
    path: outputPath,
    filename: 'index.server.bundle.js',
    libraryTarget: 'commonjs',
    publicPath,
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
  clientConfig,
  serverConfig,
];
