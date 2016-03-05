var
  path = require('path'),
  webpack = require('webpack');

var packageInformation = require('./package.json');

/**
 * The variable __POINT_CONFIG__ will be available on the global scope.
 * Contains env/build dependent information. (e.g. to adjust log-level)
 */
var definePlugin = new webpack.DefinePlugin({
  __POINZ_CONFIG__: JSON.stringify({
    env: 'dev',
    version: packageInformation.version + '-dev', // PoinZ version that is displayed in the ui
    buildTime: new Date().getTime(),
    wsUrl: 'http://localhost:3000' // backend websocket endpoint
  })
});

module.exports = {
  entry: './app/app.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/assets/',
    filename: 'bundle.js'
  },
  debug: true,
  devtool: 'source-map',
  module: {
    // loaders for correctly handling "import"s (require) of css files, images and ES2015 js files
    loaders: [
      {
        // process stylus files (to css) on the fly
        // stylus files will end up as <style> tags (pure css) in the DOM
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader'
      },
      {
        // load css files and put them as <style> tags in the DOM
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        // transpile js files with babel on the fly
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        // load images: if filesize is lower than limit -> data-url (base64), plain url and packed file otherwise
        test: /\.(|png|jpg|gif)$/,
        loader: 'url?limit=8192'
      },

      // now some font loaders (needed for zuehlke font and font-awesome icons)
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=image/svg+xml"
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/octet-stream"
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file"
      }
    ]
  },
  plugins: [definePlugin],
  devServer: {
    // enables support for HTML5 urls ( http://host:port/context/ROOM instead of http://host:port/context/#ROOM)
    // during dev serving
    historyApiFallback: true
  }

};
