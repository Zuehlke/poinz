const path = require('path');
const webpack = require('webpack');

const packageInformation = require('./package.json');

/**
 * The variable __POINT_CONFIG__ will be available on the global scope.
 * Contains env/build dependent information. (e.g. to adjust log-level)
 */
const definePlugin = new webpack.DefinePlugin({
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
  devtool: 'source-map',
  module: {
    rules: [
      {
        // process stylus files (to css) on the fly
        // stylus files will end up as <style> tags (pure css) in the DOM
        test: /\.styl$/,
        use: ['style-loader', 'css-loader', 'stylus-loader']
      },
      {
        // load css files and put them as <style> tags in the DOM
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        // transpile js files with babel on the fly
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        // load and parse json files
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        // load images: if filesize is lower than limit -> data-url (base64), plain url and packed file otherwise
        test: /\.(|png|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192
          }
        }
      },

      // now some font loaders (needed for zuehlke font and font-awesome icons)
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff'
          }
        }
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff'
          }
        }
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml'
          }
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream'
          }
        }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader'
      }
    ]
  },
  plugins: [definePlugin],
  devServer: {
    // enables support for HTML5 urls ( http://host:port/context/ROOM instead of http://host:port/context/#ROOM)
    // during dev serving
    historyApiFallback: true,

    // proxy request to the rest api (our server does not send CORS headers intentionally)
    proxy: {
      '/api/*': {
        target: 'http://localhost:3000',
        secure: false
      }
    }
  }

};
