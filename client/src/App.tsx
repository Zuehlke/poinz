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
import {usePostHogIdentify} from './hooks/usePostHogIdentify';

import GlobalStyle from './_styled';

log.setLevel(appConfig.env === 'dev' ? 'debug' : 'error');
const store = configureStore(initialState());

function AppContent() {
  usePostHogIdentify();
  return (
    <>
      <GlobalStyle />
      <Main />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <WithL10n>
          <AppContent />
        </WithL10n>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
