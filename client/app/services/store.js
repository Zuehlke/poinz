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

function rootReducer(state = Immutable.fromJS({}), action = {}) {
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
