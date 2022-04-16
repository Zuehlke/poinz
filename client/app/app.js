import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import log from 'loglevel';

import 'purecss';
import '../node_modules/purecss/build/grids-responsive-min.css';
import './assets/font/poinz.css';
import './assets/font/animation.css';

import appConfig from './services/appConfig';
import initialState from './state/initialState';
import configureStore from './state/configureStore';
import {WithL10n} from './services/l10n';
import ErrorBoundary from './components/common/ErrorBoundary';
import Main from './components/Main';

import GlobalStyle from './_styled';

log.setLevel(appConfig.env === 'dev' ? 'debug' : 'error');

const container = document.getElementById('app-root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
const store = configureStore(initialState());
root.render(
  <ErrorBoundary>
    <Provider store={store}>
      <WithL10n>
        <GlobalStyle />
        <Main />
      </WithL10n>
    </Provider>
  </ErrorBoundary>
);
