var
  path = require('path'),
  webpack = require('webpack');

var packageInformation = require('./package.json');
var defaultConfig = require('./webpack.config.js');

var definePlugin = new webpack.DefinePlugin({
  __POINZ_CONFIG__: JSON.stringify({
    env: 'production',
    version: packageInformation.version,
    buildTime: new Date().getTime()
    //wsUrl: '' //  do not set wsUrl -> hub will use socketIO default (which is: same host as the app is served)
  })
});

// override our default webpack config
defaultConfig.plugins = [definePlugin];
defaultConfig.debug = false;
defaultConfig.devtool = undefined;

module.exports = defaultConfig;
