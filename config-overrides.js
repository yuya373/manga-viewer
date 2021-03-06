const path = require('path');
const { override, addWebpackAlias } = require('customize-cra');

module.exports = override(
  config => {
    config.node = {};
    config.target = 'electron-renderer';
    config.output.globalObject = 'this';
    config.module.rules.unshift({
      test: /\.worker\.ts$/,
      use: [{ loader: 'worker-loader' }],
    });
    return config;
  },
  addWebpackAlias({
    ws$: path.resolve(__dirname, 'ws.js'),
  })
);
