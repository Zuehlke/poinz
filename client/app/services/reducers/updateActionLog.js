import {formatTime} from '../timeUtil';
import {v4 as uuid} from 'uuid';

/**
 * adds a log message for a backend event to the state.
 *
 * @param {undefined | string | function} logObject defined in event handlers.
 *         If this is a function: username, eventPayload, oldState and newState will be passed.
 *         The function can return undefined or empty string/undefined (then no logEntry will be added)
 * @param {object} oldState The state before the action was reduced
 * @param {object} state The redux state
 * @param {object} event
 * @returns {object} The new state containing updated actionLog
 */
export default function updateActionLog(logObject, oldState, state, event) {
  if (!logObject) {
    return state;
  }

  const matchingUser = state.users && state.users[event.userId];
  const username = matchingUser ? matchingUser.username || '' : '';
  const messageObject =
    typeof logObject === 'function'
      ? logObject(username, event.payload, oldState, state, event)
      : logObject;

  if (!messageObject) {
    return state;
  }

  const newLogItem = {
    tstamp: formatTime(Date.now()),
    logId: uuid()
  };
  if (typeof messageObject === 'string') {
    newLogItem.message = messageObject;
  } else {
    newLogItem.message = messageObject.message;
    newLogItem.isError = messageObject.isError;
  }

  return {
    ...state,
    actionLog: [newLogItem, ...(state.actionLog || [])]
  };
}
