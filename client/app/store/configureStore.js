import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import log from 'loglevel';

import rootReducer from '../services/rootReducer';
import hub from '../services/hub';
import {
  EVENT_ACTION_TYPES,
  EVENT_RECEIVED
} from '../actions/types';

const LOGGER = log.getLogger('store');

const loggerMiddleware = store => next => action => {
  LOGGER.debug('reducing action', action);
  let result = next(action);
  LOGGER.debug('modified state ', store.getState().toJS());
  return result;
};

/**
 * configures and sets up the redux store.
 *
 * @param {Immutable.Map} [initialState]
 * @param {object} the redux store
 */
export default function configureStore(initialState) {

  let store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  );

  /**
   * Backend events that are received by the hub are dispatched to our redux store
   * if we "know" the event (i.e. eventName is a defined event type)
   */
  hub.on('event', event => {
    const matchingType = EVENT_ACTION_TYPES[event.name];
    if (!matchingType) {
      LOGGER.error(`Unknown incoming event type ${event.name}. Will not dispatch a specific action.`);
      return;
    }

    // dispatch a generic action
    store.dispatch({
      type: EVENT_RECEIVED,
      correlationId: event.correlationId
    });

    // dispatch the specific event action
    store.dispatch({
      event,
      type: matchingType
    });
  });

  return store;
}
