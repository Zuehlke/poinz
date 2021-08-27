import {EVENT_ACTION_TYPES, ROOM_STATE_FETCHED} from '../actions/eventActions';
import {
  setPresetAvatar,
  setPresetEmail,
  setPresetUserId,
  setPresetUsername
} from '../clientSettingsStore';
import {getUserPresets} from '../clientSettingsStore';

/*
 * in our frontend, we store users as object (key is the user's id).
 * this differs from the PoinZ Backend, where users is a array...
 */
export const usersInitialState = {
  ownUserId: undefined,
  ownUserToken: undefined,
  usersById: {},
  presets: getUserPresets() // presets, stored in localStorage; username, userId, avatar, email
};

/**
 *
 * @param {object} state The "users" portion of the redux state
 * @param action
 * @param {string | undefined} ownUserId
 * @return {object}
 */
export default function usersReducer(state = usersInitialState, action, ownUserId) {
  const {event} = action;

  switch (action.type) {
    case ROOM_STATE_FETCHED:
      return {
        ...state,
        usersById: indexUsers(action.room.users)
      };

    // joining, leaving room
    case EVENT_ACTION_TYPES.joinedRoom: {
      if (action.ourJoin) {
        setPresetUserId(event.userId);

        return {
          ...state,
          presets: {...state.presets, userId: event.userId},
          ownUserId: event.userId,
          usersById: indexUsers(event.payload.users)
        };
      } else {
        return {
          ...state,
          usersById: indexUsers(event.payload.users)
        };
      }
    }
    case EVENT_ACTION_TYPES.tokenIssued: {
      // just to make sure.. backend will only send tokenIssued to one client anyways..
      if (event.userId === ownUserId) {
        return {
          ...state,
          ownUserToken: event.payload.token
        };
      } else {
        return state;
      }
    }
    case EVENT_ACTION_TYPES.kicked: {
      const kickedUserId = event.payload.userId;
      if (kickedUserId === ownUserId) {
        // you got kicked ;)
        return {...usersInitialState};
      } else {
        return deleteUser(state, kickedUserId);
      }
    }
    case EVENT_ACTION_TYPES.leftRoom: {
      if (event.userId === ownUserId) {
        return {...usersInitialState};
      } else {
        return deleteUser(state, event.userId);
      }
    }
    case EVENT_ACTION_TYPES.connectionLost: {
      if (!state.usersById[event.userId]) {
        return state;
      }

      return modifyUser(state, event.userId, (user) => ({
        ...user,
        disconnected: true
      }));
    }

    // user properties modifications
    case EVENT_ACTION_TYPES.avatarSet: {
      const intermediateState = modifyUser(state, event.userId, (user) => ({
        ...user,
        avatar: event.payload.avatar
      }));

      if (state.ownUserId === event.userId) {
        setPresetAvatar(event.payload.avatar);
        return {
          ...intermediateState,
          presets: {...state.presets, avatar: event.payload.avatar}
        };
      } else {
        return intermediateState;
      }
    }
    case EVENT_ACTION_TYPES.emailSet: {
      const intermediateState = modifyUser(state, event.userId, (user) => ({
        ...user,
        email: event.payload.email,
        emailHash: event.payload.emailHash
      }));

      if (state.ownUserId === event.userId) {
        setPresetEmail(event.payload.email);
        return {
          ...intermediateState,
          presets: {...state.presets, email: event.payload.email}
        };
      } else {
        return intermediateState;
      }
    }
    case EVENT_ACTION_TYPES.usernameSet: {
      const intermediateState = modifyUser(state, event.userId, (user) => ({
        ...user,
        username: event.payload.username
      }));
      if (state.ownUserId === event.userId) {
        setPresetUsername(event.payload.username);
        return {
          ...intermediateState,
          presets: {...state.presets, username: event.payload.username}
        };
      } else {
        return intermediateState;
      }
    }

    // including / excluding user from estimation
    case EVENT_ACTION_TYPES.excludedFromEstimations: {
      return modifyUser(state, event.payload.userId, (user) => ({
        ...user,
        excluded: true
      }));
    }
    case EVENT_ACTION_TYPES.includedInEstimations: {
      return modifyUser(state, event.payload.userId, (user) => ({
        ...user,
        excluded: false
      }));
    }
  }

  return state;
}

/**
 * index given users array by userId into a map
 *
 * @param {object[]} usersArray Array of users objects as in payload of backend events
 * @return {*}
 */
function indexUsers(usersArray) {
  return (usersArray || []).reduce((total, currentUser) => {
    total[currentUser.id] = currentUser;
    return total;
  }, {});
}

/**
 * Modify one user in the given state
 *
 * @param {object} state
 * @param userId
 * @param {function} modifier Will be invoked with the matching user from the user map (which can be undefined, if no such user is in the map)
 */
function modifyUser(state, userId, modifier) {
  if (!userId) {
    return state;
  }
  const modifiedUser = modifier(state.usersById[userId]);

  return {
    ...state,
    usersById: {
      ...state.usersById,
      [userId]: modifiedUser
    }
  };
}

/**
 * delete the matching user in the state
 *
 * @param state
 * @param userId
 */
function deleteUser(state, userId) {
  const modifiedUsers = {...state.usersById};
  delete modifiedUsers[userId];

  return {
    ...state,
    usersById: modifiedUsers
  };
}
