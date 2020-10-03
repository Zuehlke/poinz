const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const prodConfig = require('./webpack.production.config.js');

prodConfig.plugins.push(new BundleAnalyzerPlugin());

module.exports = prodConfig;
