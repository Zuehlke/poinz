import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import log from 'loglevel';

import eventReducer from './eventReducer';
import hub from './hub';
import { TOGGLE_BACKLOG, TOGGLE_USER_MENU, EVENT_ACTION_TYPES } from './actionTypes';

const LOGGER = log.getLogger('store');

/**
 * the root redux reducer that decides if
 * - the action should be handled by an event reducer (backend event gets applied to our state)
 * - the action is a UI-only action (some state changes in the client only)
 */
function rootReducer(state = {}, action = {}) {
  LOGGER.debug('reducing action', action);
  const modifiedState = triage(state, action);
  LOGGER.debug('modified state ', modifiedState.toJS());
  return modifiedState;
}

function triage(state, action) {
  if (action.event) {
    return eventReducer(state, action);
  } else {
    switch (action.type) {
      case 'COMMAND_SENT':
        return state.setIn(['pendingCommands', action.command.id], action.command);
      case 'SET_ROOMID':
        return state.set('roomId', action.roomId);
      case TOGGLE_BACKLOG:
        return state.set('backlogShown', !state.get('backlogShown'));
      case TOGGLE_USER_MENU:
        return state.set('userMenuShown', !state.get('userMenuShown'));
      default :
        LOGGER.warn('unknown UI action', action);
        return state;
    }
  }
}


export default function configureStore(initialState) {
  let store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunkMiddleware)
  );


  /**
   * Backend events that are received by the hub are dispatched to our redux store
   * if we "know" the event (i.e. eventName is a defined event type)
   */
  hub.on('event', event => {
    const matchingType = EVENT_ACTION_TYPES[event.name];
    if (matchingType) {
      store.dispatch({
        event,
        type: matchingType
      });
    } else {
      LOGGER.error('Unknown event type' + event.name);
    }
  });

  return store;
}
