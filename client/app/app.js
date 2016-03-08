import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import log from 'loglevel';

/*eslint-disable no-unused-vars */
import normalizeCss from 'normalize.css';
import pureCss from 'purecss';
import pureCssResponsive from '../node_modules/purecss/build/grids-responsive-min.css';
import fontAwesome from '../node_modules/font-awesome/css/font-awesome.min.css';
import poinzStyles from './assets/poinz.styl';
/*eslint-enable no-unused-vars */

import initialState from './services/initialState';
import configureStore from './services/configureStore';

import Main from './components/Main';

const appConfig = __POINZ_CONFIG__; // this is set via webpack (see webpack.config.js and webpack.production.config.js)

if (appConfig.env === 'dev') {
  log.setLevel('debug');
  //localStorage.debug = 'socket.io-client:*'; // enable socket.io debugging
} else {
  log.setLevel('error');
}

const store = configureStore(initialState);
render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById('app-root')
);
