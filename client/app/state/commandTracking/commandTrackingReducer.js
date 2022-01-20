import {COMMAND_SENT} from '../actions/commandActions';
import {EVENT_ACTION_TYPES, EVENT_RECEIVED} from '../actions/eventActions';

export const commandTrackingInitialState = {
  pendingJoinCommandId: undefined,
  roomIdJoinAuthFail: undefined, // contains the roomId in case of failed "join" command because of missing or wrong password / token
  pendingCommands: {}
};

/**
 * For every command we send, let's store it in our client state as "pending command".
 * various view components are then able to display "spinners" when waiting for the corresponding backend event.
 * limitations:
 *  - the first event produced by a command will remove it (consider that the backend might produce N events for a single command that is processed)
 *  - if the backend does not produce an event for a command, the command will remain in the client state.
 *
 *  It is also crucial for the join-room flow. We need to know which "roomJoined" event is ours. We cannot rely on the userId. For first-time-users (no presets yet), we don't have a userId.
 *  Thus we save our commandId, when we send a "joinRoom" command.
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
      const modifiedState = {
        ...state,
        pendingCommands: {
          ...state.pendingCommands,
          [action.command.id]: action.command
        }
      };

      if (action.command.name === 'joinRoom') {
        modifiedState.pendingJoinCommandId = action.command.id;
      }
      return modifiedState;
    }

    case EVENT_RECEIVED: {
      // for every event that we receive, we remove the corresponding command if any. (i.e. the command that triggered that event in the backend)
      const modifiedPendingCommands = {...state.pendingCommands};
      delete modifiedPendingCommands[action.correlationId];
      return {...state, pendingCommands: modifiedPendingCommands};
    }

    case EVENT_ACTION_TYPES.joinedRoom: {
      if (action.ourJoin) {
        return {
          ...state,
          pendingJoinCommandId: undefined,
          roomIdJoinAuthFail: undefined
        };
      } else {
        return state;
      }
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
        return {...commandTrackingInitialState};
      } else {
        return state;
      }
    }

    case EVENT_ACTION_TYPES.commandRejected: {
      if (isAuthFailedJoinRejected(event)) {
        // joinRoom failed to a a password-protected room. Let's store the roomId on our state.
        // this will be used to indicate "we tried to enter a password protected room - but failed"
        // -> the user will be presented with the "room is protected, enter password" view. The user can re-enter password and try again.
        return {
          ...state,
          pendingJoinCommandId: undefined,
          roomIdJoinAuthFail: event.payload.command.roomId
        };
      } else {
        return state;
      }
    }
  }

  return state;
}

const isAuthFailedJoinRejected = (event) => {
  if (event.payload && event.payload.command && event.payload.command.name === 'joinRoom') {
    const reason = event.payload.reason;

    return reason.includes('Not Authorized');
  }
  return false;
};
