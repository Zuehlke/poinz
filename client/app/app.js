import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import log from 'loglevel';

/*eslint-disable no-unused-vars */
import normalizeCss from '../node_modules/normalize.css/normalize.css';
import pureCss from 'purecss';
import pureCssResponsive from '../node_modules/purecss/build/grids-responsive-min.css';
import fontAwesome from '../node_modules/font-awesome/css/font-awesome.min.css';
import poinzStyles from './assets/poinz.styl';
import '../node_modules/react-notifications/lib/notifications.css';
/*eslint-enable no-unused-vars */

import appConfig from './services/appConfig';
import initialState from './services/initialState';
import configureStore from './services/configureStore';

import Main from './components/Main';

if (appConfig.env === 'dev') {
  log.setLevel('debug');
  localStorage.debug = 'socket.io-client:*'; // enable socket.io debugging
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
