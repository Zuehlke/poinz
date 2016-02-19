import { createStore, bindActionCreators } from 'redux';
import Immutable from 'immutable';
import log from 'loglevel';
import _ from 'lodash';
import * as splushActions from './actions'
import hubFactory from './hub';
import commandReducerFactory from './commandReducer';
import eventReducerFactory from './eventReducer';

const LOGGER = log.getLogger('store');

let commandReducer = _.noop;
let eventReducer = _.noop;

const START_STATE = Immutable.fromJS({
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
    {label: '?', value: -1},
    {label: 'Coffee', value: -2}
  ]
});

function rootReducer(state = START_STATE, action = {}) {
  LOGGER.debug('reducing action', action);
  if (action.event) {
    return eventReducer(state, action);
  } else {
    return commandReducer(state, action);
  }
}

let store = createStore(rootReducer);
const actions = bindActionCreators(splushActions, store.dispatch);
commandReducer = commandReducerFactory(hubFactory(actions));
eventReducer = eventReducerFactory();

export default store;
