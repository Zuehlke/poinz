import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import log from 'loglevel';

import 'purecss';
import '../node_modules/purecss/build/grids-responsive-min.css';
import './assets/font/poinz.css';
import './assets/font/animation.css';

import appConfig from './services/appConfig';
import initialState from './state/initialState';
import configureStore from './state/configureStore';

import Main from './components/Main';
import Global from './_styled';

if (appConfig.env === 'dev') {
  log.setLevel('debug');
  // localStorage.debug = 'socket.io-client:*'; // enable socket.io debugging
} else {
  log.setLevel('error');
}

const store = configureStore(initialState());
render(
  <Provider store={store}>
    <Global />
    <Main />
  </Provider>,
  document.getElementById('app-root')
);
