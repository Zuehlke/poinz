import {createStore, applyMiddleware, compose, bindActionCreators} from 'redux';
import thunkMiddleware from 'redux-thunk';

import rootReducer from './rootReducer';
import hubFactory from './hub';
import {eventReceived} from './actions/eventActions';
import {locationChanged, onSocketConnect} from './actions/commandActions';
import history from './getBrowserHistory';
import appConfig from '../services/appConfig';
import {getOwnUserId} from './users/usersSelectors';
import {getRoomId} from './room/roomSelectors';

/**
 * configures and sets up the redux store.
 *
 * @param {object} [initialState]
 */
export default function configureStore(initialState) {
  const composeEnhancers =
    (typeof window !== 'undefined' &&
      appConfig.env === 'dev' &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;

  let hub;

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(
        // "sendCommand" will be available in redux action creators as third argument
        thunkMiddleware.withExtraArgument((cmd) => hub.sendCommand(cmd))
      )
    )
  );

  const boundActions = bindActionCreators(
    {locationChanged, eventReceived, onSocketConnect},
    store.dispatch
  );

  if (typeof window === 'object' && window.Cypress && appConfig.env === 'dev') {
    // leak store to window object for debugging purposes during cypress tests
    window.__POINZ_REDUX_STORE__ = store;
  }

  // create our hub instance, provide it with "dispatch", "getUserId" and "getRoomId" callbacks
  hub = hubFactory(
    store.dispatch,
    () => getOwnUserId(store.getState()),
    () => getRoomId(store.getState())
  );

  // All backend events that are received by the hub are dispatched to our redux store
  hub.onEvent((event) => boundActions.eventReceived(event));

  hub.onConnect(() => boundActions.onSocketConnect());

  // "sync" url changes to our redux store. if location changes -> store pathname in state
  history.listen(({location}) => boundActions.locationChanged(location.pathname));

  // and fire it once initially, so that the pathname on first page load is stored
  boundActions.locationChanged(history.location.pathname);

  return store;
}
