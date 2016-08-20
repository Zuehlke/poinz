import log from 'loglevel';
import Immutable from 'immutable';

import eventReducer from './eventReducer';
import {
  TOGGLE_BACKLOG,
  TOGGLE_USER_MENU,
  EDIT_STORY,
  CANCEL_EDIT_STORY,
  COMMAND_SENT,
  EVENT_RECEIVED,
  SET_ROOMID,
  STATUS_FETCHED
} from './actionTypes';

const LOGGER = log.getLogger('rootReducer');

/**
 * the root redux reducer that decides if
 * - the action should be handled by an event reducer (when a backend event gets applied to our client state)
 * - the action is a client-only action (some state changes in the client only, i.e. view state)
 *
 * @param state
 * @param {object} action the redux action
 * @returns {Immutable.Map} the modified state
 */
export default function rootReducer(state = {}, action = {}) {
  if (action.event) {
    return eventReducer(state, action);
  } else {
    switch (action.type) {
      case COMMAND_SENT:
        // for every command we send, let's store it in our client state as "pending command". various view components
        // are then able to display "spinners" when waiting for the corresponding backend event.
        // limitations:
        // - the first event produced by a command will again remove (consider that the backend might produce N events for a single command that is processed)
        // - if the backend does not produce an event for a command, the command will remain in the client state.
        return state.setIn(['pendingCommands', action.command.id], action.command);
      case EVENT_RECEIVED:
        // for every event that we receive, we remove the corresponding command if any. (i.e. the command that triggered that event in the backend)
        return state.removeIn(['pendingCommands', action.correlationId]);
      case SET_ROOMID:
        return state.set('roomId', action.roomId);
      case TOGGLE_BACKLOG:
        return state.set('backlogShown', !state.get('backlogShown'));
      case TOGGLE_USER_MENU:
        return state.set('userMenuShown', !state.get('userMenuShown'));
      case EDIT_STORY:
        return state.setIn(['stories', action.storyId, 'editMode'], true);
      case CANCEL_EDIT_STORY:
        return state.setIn(['stories', action.storyId, 'editMode'], false);
      case STATUS_FETCHED:
        return state.set('appStatus', Immutable.fromJS(action.status));
      default :
        LOGGER.warn('unknown action', action);
        return state;
    }
  }
}
