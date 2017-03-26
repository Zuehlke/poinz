import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import log from 'loglevel';

import 'purecss';
import '../node_modules/purecss/build/grids-responsive-min.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import './assets/poinz.styl';

import appConfig from './services/appConfig';
import initialState from './store/initialState';
import configureStore from './store/configureStore';

import Main from './containers/Main';

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
