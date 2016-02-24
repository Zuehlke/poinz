var
  path = require('path'),
  webpack = require('webpack');

var packageInformation = require('./package.json');
var defaultConfig = require('./webpack.config.js');

var definePlugin = new webpack.DefinePlugin({
  __POINZ_CONFIG__: JSON.stringify({
    env: 'production',
    version: packageInformation.version
    //wsUrl: 'http://poker-xeronimus.rhcloud.com:8000'
  })
});

defaultConfig.plugins = [definePlugin];

module.exports = defaultConfig;
