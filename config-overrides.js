const { override } = require('customize-cra');

module.exports = override(
  config => {
    config.node = {};
    config.target = 'electron-renderer';
    return config;
  },
);
