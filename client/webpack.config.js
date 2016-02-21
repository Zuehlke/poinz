var
  path = require('path'),
  webpack = require('webpack');

var definePlugin = new webpack.DefinePlugin({
  __SPLUSH_CONFIG__: JSON.stringify({
    env: 'dev'
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
        test: /\.(woff2|woff|png|jpg|gif)$/,
        loader: 'url?limit=8192'
      }
    ]
  },
  plugins: [definePlugin],
  devServer: {
    historyApiFallback: true
  }

};
