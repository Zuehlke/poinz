const path = require('path');
const webpack = require('webpack');
const execSync = require('child_process').execSync;

const packageInformation = require('./package.json');
const readChangelogToHtml = require('./readChangelogToHtml');

/**
 * The variable __POINT_CONFIG__ will be available on the global scope.
 * Contains env/build dependent information. (e.g. to adjust log-level)
 */
const definePlugin = new webpack.DefinePlugin({
  __POINZ_CONFIG__: JSON.stringify({
    env: 'dev',
    version: packageInformation.version + '-dev', // PoinZ version that is displayed in the ui
    vcsInfo: getGitInformation(),
    buildTime: Date.now(),
    changeLog: readChangelogToHtml()
  })
});

module.exports = {
  mode: 'development',

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
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
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

      // file loader for directly imported Zühlke font (in _styled.js).
      // as of Aug2021 / css-loader 6.x does not use this loader -> no impact on fontello icon font "poinz"
      {
        test: /aazuotps_30.12.13-webfont.woff2/, // <- matches the zühlke font
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          }
        }
      }
    ]
  },

  plugins: [definePlugin],

  resolve: {extensions: ['.wasm', '.mjs', '.js', '.jsx', '.json']},

  devServer: {
    // enables support for HTML5 urls ( http://host:port/context/ROOM instead of http://host:port/context/#ROOM)
    // during dev serving
    historyApiFallback: true,

    static: {
      directory: path.join(__dirname)
    },
    compress: true,
    port: 9000,

    devMiddleware: {
      index: true,
      publicPath: '/assets/'
    },

    // proxy request to the rest api (our server does not send CORS headers intentionally)
    proxy: {
      '/api/*': {
        target: 'http://localhost:3000',
        secure: false
      },
      '/socket.io/*': {
        target: 'http://localhost:3000',
        secure: false
      }
    }
  }
};

function getGitInformation() {
  const gitExecOptions = {cwd: __dirname, timeout: 1000, encoding: 'utf-8'};
  const abbrev = execSync('git rev-parse --abbrev-ref HEAD', gitExecOptions);
  const short = execSync('git rev-parse --short HEAD', gitExecOptions);

  return {
    branch: abbrev.split('\n').join(''),
    hash: short.split('\n').join('')
  };
}
