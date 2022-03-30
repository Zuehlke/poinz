import {COMMAND_SENT} from '../actions/commandActions';
import {EVENT_ACTION_TYPES, EVENT_RECEIVED} from '../actions/eventActions';

export const commandTrackingInitialState = {
  pendingCommands: {}
};

/**
 * For every command we send, let's store it in our client state as "pending command".
 * various view components are then able to display "spinners" when waiting for the corresponding backend event.
 * limitations:
 *  - the first event produced by a command will remove it (consider that the backend might produce N events for a single command that is processed)
 *  - if the backend does not produce an event for a command, the command will remain in the client state.
 *
 * @param {object} state The "commandTracking" portion of the redux state
 * @param action
 * @param {string | undefined} ownUserId
 * @return
 */
export default function commandTrackingReducer(
  state = commandTrackingInitialState,
  action,
  ownUserId
) {
  const {event} = action;

  switch (action.type) {
    case COMMAND_SENT: {
      return {
        ...state,
        pendingCommands: {
          ...state.pendingCommands,
          [action.command.id]: action.command
        }
      };
    }

    case EVENT_RECEIVED: {
      // for every event that we receive, we remove the corresponding command if any. (i.e. the command that triggered that event in the backend)
      const modifiedPendingCommands = {...state.pendingCommands};
      delete modifiedPendingCommands[action.correlationId];
      return {...state, pendingCommands: modifiedPendingCommands};
    }

    case EVENT_ACTION_TYPES.leftRoom: {
      if (event.userId === ownUserId) {
        return {...commandTrackingInitialState};
      } else {
        return state;
      }
    }
    case EVENT_ACTION_TYPES.kicked: {
      if (event.payload.userId === ownUserId) {
        // make sure to use payload.userId (the kicked user, not the kicking user)
        return {...commandTrackingInitialState};
      } else {
        return state;
      }
    }
  }

  return state;
}
