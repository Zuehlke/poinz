const webpack = require('webpack');

const packageInformation = require('./package.json');
const readChangelogToHtml = require('./readChangelogToHtml');
const defaultConfig = require('./webpack.config.js');

const definePlugin = new webpack.DefinePlugin({
  __POINZ_CONFIG__: JSON.stringify({
    env: 'production',
    version: packageInformation.version,
    buildTime: Date.now(),
    changeLog: readChangelogToHtml()
    //wsUrl: '' //  do not set wsUrl -> hub will use socketIO default (which is: same host as the app is served)
  })
});

// override our default webpack config
defaultConfig.plugins = [definePlugin];
defaultConfig.devtool = 'eval';
defaultConfig.mode = 'production';

module.exports = defaultConfig;
