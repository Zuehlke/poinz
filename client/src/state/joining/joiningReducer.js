import {getItem, persistOnStateChange} from '../clientSettingsStore';
import {COMMAND_SENT, JOIN_PROPERTIES_ADDED} from '../actions/commandActions';
import {EVENT_ACTION_TYPES} from '../actions/eventActions';

const PRESET_USER_NAME = 'presetUserName';
const PRESET_EMAIL = 'presetEmail';
const PRESET_AVATAR = 'presetAvatar';
const PRESET_USER_ID = 'presetUserId';

/**
 * Will contain data during the joinRoom workflow
 * Data is needed during/in-between these views: from landing page & join room form to "who are you" (username) to password prompt
 */
export const joiningInitialState = {
  roomId: undefined,
  userdata: {
    avatar: parseInt(getItem(PRESET_AVATAR) || 0, 10),
    username: getItem(PRESET_USER_NAME),
    userId: getItem(PRESET_USER_ID),
    email: getItem(PRESET_EMAIL)
  },
  pendingJoinCommandId: undefined,
  authFailed: false
};

persistOnStateChange(PRESET_AVATAR, (state) => state.joining.userdata.avatar);
persistOnStateChange(PRESET_USER_NAME, (state) => state.joining.userdata.username);
persistOnStateChange(PRESET_EMAIL, (state) => state.joining.userdata.email);
persistOnStateChange(PRESET_USER_ID, (state) => state.joining.userdata.userId);

/**
 *
 * @param {object} state The "joining" portion of the redux state
 * @param action
 * @param {string} ownUserId
 * @return {object}
 */
export default function joiningReducer(state = joiningInitialState, action, ownUserId) {
  const {event} = action;

  switch (action.type) {
    case JOIN_PROPERTIES_ADDED: {
      return {
        ...state,
        roomId: action.roomId || state.roomId,
        userdata: {
          ...state.userdata,
          ...action.properties
        }
      };
    }

    case COMMAND_SENT: {
      if (action.command.name === 'joinRoom') {
        return {
          ...state,
          pendingJoinCommandId: action.command.id
        };
      } else {
        return state; // all other commands do not concern us here
      }
    }

    case EVENT_ACTION_TYPES.joinedRoom: {
      if (action.ourJoin) {
        return {
          ...joiningInitialState,
          userdata: {
            ...state.userdata,
            userId: event.userId,
            password: undefined
          }
        };
      } else {
        return state;
      }
    }

    case EVENT_ACTION_TYPES.avatarSet: {
      if (ownUserId === event.userId) {
        return {
          ...state,
          userdata: {
            ...state.userdata,
            avatar: event.payload.avatar
          }
        };
      } else {
        return state;
      }
    }

    case EVENT_ACTION_TYPES.emailSet: {
      if (ownUserId === event.userId) {
        return {
          ...state,
          userdata: {
            ...state.userdata,
            email: event.payload.email
          }
        };
      } else {
        return state;
      }
    }

    case EVENT_ACTION_TYPES.usernameSet: {
      if (ownUserId === event.userId) {
        return {
          ...state,
          userdata: {
            ...state.userdata,
            username: event.payload.username
          }
        };
      } else {
        return state;
      }
    }

    case EVENT_ACTION_TYPES.leftRoom: {
      if (ownUserId === event.userId) {
        return {...joiningInitialState};
      } else {
        return state;
      }
    }

    case EVENT_ACTION_TYPES.commandRejected: {
      if (isAuthFailedJoinRejected(action.event)) {
        // joinRoom failed to a a password-protected room.
        // this will be used to indicate "we tried to enter a password protected room - but failed"
        // -> the user will be presented with the "room is protected, enter password" view. The user can re-enter password and try again.
        return {
          ...state,
          pendingJoinCommandId: undefined,
          authFailed: true
        };
      } else {
        return state;
      }
    }
  }

  return state;
}

const isAuthFailedJoinRejected = (event) => {
  if (event.payload?.command?.name === 'joinRoom') {
    return event.payload.reason.includes('Not Authorized');
  }
  return false;
};
