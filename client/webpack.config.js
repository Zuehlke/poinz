var
  path = require('path'),
  webpack = require('webpack');

var packageInformation = require('./package.json');

var definePlugin = new webpack.DefinePlugin({
  __POINZ_CONFIG__: JSON.stringify({
    env: 'dev',
    wsUrl: 'http://localhost:3000',
    version: packageInformation.version + '-dev'
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
    loaders: [
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
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
    historyApiFallback: true
  }

};
