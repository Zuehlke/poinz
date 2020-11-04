import {createStore, applyMiddleware, compose, bindActionCreators} from 'redux';
import thunkMiddleware from 'redux-thunk';

import rootReducer from '../services/rootReducer';
import hubFactory from '../services/hub';
import {locationChanged, eventReceived, onSocketConnect} from '../actions';
import history from '../services/getBrowserHistory';

/**
 * configures and sets up the redux store.
 *
 * @param {object} [initialState]
 */
export default function configureStore(initialState) {
  const composeEnhancers =
    (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  let hub;

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(thunkMiddleware.withExtraArgument((cmd) => hub.sendCommand(cmd)))
    )
  );

  // create our hub instance, provide it with "dispatch" and "getUserId" callbacks
  hub = hubFactory(store.dispatch, () => store.getState().userId);
  // All backend events that are received by the hub are dispatched to our redux store
  hub.onEvent((event) => boundActions.eventReceived(event));

  hub.onConnect(() => boundActions.onSocketConnect());

  const boundActions = bindActionCreators(
    {locationChanged, eventReceived, onSocketConnect},
    store.dispatch
  );

  // "sync" url changes to our redux store. if location changes -> store pathname in state
  history.listen(({location}) => boundActions.locationChanged(location.pathname));

  // and fire it once initially, so that the pathname on first page load is stored
  boundActions.locationChanged(history.location.pathname);

  return store;
}
