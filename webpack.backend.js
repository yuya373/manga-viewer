const path = require('path');

module.exports = {
  mode: 'production',
  target: 'electron-main',
  entry: './backend/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build'),
  },
  node: {
    __dirname: false,
    __filename: false,
  },
};
