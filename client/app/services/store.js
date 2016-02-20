import { createStore, bindActionCreators } from 'redux';
import Immutable from 'immutable';
import log from 'loglevel';
import _ from 'lodash';
import * as splushActions from './actions';
import * as types from './actionTypes';
import hubFactory from './hub';
import commandReducerFactory from './commandReducer';
import eventReducerFactory from './eventReducer';
import clientSettingsStore from './clientSettingsStore';

const LOGGER = log.getLogger('store');

let commandReducer = _.noop;
let eventReducer = _.noop;

const INITIAL_STATE = Immutable.fromJS({
// TODO: creator of room can choose card values
// TODO: store creator's selection to local storage and use as default
// for the moment, this is fixed.
  cardConfig: [
    {label: '0', value: 0},
    {label: '1/2', value: 0.5},
    {label: '1', value: 1},
    {label: '2', value: 2},
    {label: '3', value: 3},
    {label: '5', value: 5},
    {label: '8', value: 8},
    {label: '13', value: 13},
    {label: '21', value: 13},
    {label: '34', value: 13},
    {label: '55', value: 13},
    {label: '?', value: -1},
    {label: 'Coffee', value: -2}
  ],
  presetUsername: clientSettingsStore.getPresetUsername(),
  presetUserId: clientSettingsStore.getPresetUserId()
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
  if (action.event) {
    return eventReducer(state, action);
  } else if (action.command) {
    return commandReducer(state, action);
  } else {
    switch (action.type) {
      case types.TOGGLE_MENU:
        return state.set('menuShown', !state.get('menuShown'));
      default :
        LOGGER.warn('unknown command action', action);
        return state;
    }
  }
}

let store = createStore(rootReducer);
const actions = bindActionCreators(splushActions, store.dispatch);
commandReducer = commandReducerFactory(hubFactory(actions));
eventReducer = eventReducerFactory();

store.getInitialState = () => INITIAL_STATE;

export default store;
