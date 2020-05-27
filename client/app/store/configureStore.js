import {createStore, applyMiddleware, compose, bindActionCreators} from 'redux';
import thunkMiddleware from 'redux-thunk';

import rootReducer from '../services/rootReducer';
import hub from '../services/hub';
import {locationChanged, eventReceived} from '../actions';
import history from '../services/getBrowserHistory';

/**
 * configures and sets up the redux store.
 *
 * @param {object} [initialState]
 */
export default function configureStore(initialState) {
  const composeEnhancers =
    (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunkMiddleware))
  );

  const boundActions = bindActionCreators({locationChanged, eventReceived}, store.dispatch);

  // "sync" url changes to our redux store. if location changes -> store pathname in state
  history.listen((location) => boundActions.locationChanged(location.pathname));

  // and fire it once initially, so that the pathname on first page load is stored
  boundActions.locationChanged(history.location.pathname);

  // Backend events that are received by the hub are dispatched to our redux store
  hub.on('event', (event) => boundActions.eventReceived(event));

  return store;
}
