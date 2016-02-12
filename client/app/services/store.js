import { createStore } from 'redux';
import Immutable from 'immutable';
import log from 'loglevel';
import { createHistory } from 'history';
import hub from './hub';

let history = createHistory();

//history.listen(location => {
//  console.dir(location);
//});

const DEFAULT_STATE = Immutable.fromJS({});

const ACTION_TYPES = {};
export const ACTIONS = {};
['requestRoom', 'personJoinedRoom', 'roomCreated', 'joinedRoom'].forEach(actionType => {
  ACTION_TYPES[actionType] = actionType;
  ACTIONS[actionType] = payload => store.dispatch({type: actionType, payload});
});
log.debug(ACTIONS);

function rootReducer(state = DEFAULT_STATE, action = undefined) {

  log.debug('reducing action', action);

  switch (action.type) {
    case ACTION_TYPES.requestRoom:
      const roomId = action.payload;
      log.info('requesting room ', roomId);

      history.push({
        hash: `#${roomId}`
      });

      hub.requestRoom(roomId);

      return state.set('requestedRoomId', roomId);
    case ACTION_TYPES.roomCreated:
      return state.set('roomId', action.payload.roomId);
    case ACTION_TYPES.joinedRoom:
      return state
        .set('roomId', action.payload.roomId)
        .set('personId', action.payload.personId);
    case ACTION_TYPES.personJoinedRoom:
      return state.update('people', new Immutable.List(), people => people.push(action.payload.personId));
    default:
      log.warn('unknown action', action);
      return state
  }

}

let store = createStore(rootReducer);


export default store;
