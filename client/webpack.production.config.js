var
  path = require('path'),
  webpack = require('webpack');

var defaultConfig = require('./webpack.config.js');

var definePlugin = new webpack.DefinePlugin({
  __SPLUSH_CONFIG__: JSON.stringify({
    env: 'production',
    //wsUrl: 'http://poker-xeronimus.rhcloud.com:8000'
  })
});

defaultConfig.plugins = [definePlugin];

module.exports = defaultConfig;
