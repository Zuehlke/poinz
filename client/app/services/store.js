import { createStore } from 'redux';
import Immutable from 'immutable';
import log from 'loglevel';

import commandReducer from './commandReducer';
import eventReducer from './eventReducer';
import hub from './hub';
import clientSettingsStore from './clientSettingsStore';
import { TOGGLE_BACKLOG, TOGGLE_USER_MENU, EVENT_ACTION_TYPES } from './actionTypes';

const LOGGER = log.getLogger('store');

const INITIAL_STATE = Immutable.fromJS({
// TODO: creator of room can choose card values
// TODO: store creator's selection to local storage and use as default
  cardConfig: [
    {label: '?', value: -2, color: '#bdbfbf'},
    {label: '1/2', value: 0.5, color: '#667a66'},
    {label: '1', value: 1, color: '#839e7a'},
    {label: '2', value: 2, color: '#8cb876'},
    {label: '3', value: 3, color: '#96ba5b'},
    {label: '5', value: 5, color: '#b6c76b'},
    {label: '8', value: 8, color: '#c9c857'},
    {label: '13', value: 13, color: '#d9be3b'},
    {label: '21', value: 21, color: '#d6cda1'},
    {label: '34', value: 34, color: '#9fa6bd'},
    {label: '55', value: 55, color: '#6a80ab'},
    {label: 'BIG', value: -1, color: '#1d508f'}
  ],
  presetUsername: clientSettingsStore.getPresetUsername(),
  presetUserId: clientSettingsStore.getPresetUserId(),
  actionLog: []
});

/**
 * the root redux reducer that decides if
 * - the action should be handled by an event reducer (backend event gets applied to our state)
 * - the action should be handled by a command reducer (command gets sent to the backend)
 * - the action is a UI-only action (some state changes in the client only)
 *
 */
function rootReducer(state = INITIAL_STATE, action = {}) {
  LOGGER.debug('reducing action', action);
  const modifiedState = triage(state, action);
  LOGGER.debug('modified state ', modifiedState.toJS());
  return modifiedState;
}

function triage(state, action) {
  if (action.event) {
    return eventReducer(state, action);
  } else if (action.command) {
    return commandReducer(state, action);
  } else {
    // ui-only action reducer
    switch (action.type) {
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

let store = createStore(rootReducer);

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

store.getInitialState = () => INITIAL_STATE;

export default store;
