import log from 'loglevel';
import {EVENT_ACTION_TYPES} from '../actions/types';
import clientSettingsStore from '../store/clientSettingsStore';
import initialState from '../store/initialState';
import {getCardConfigForValue} from './getCardConfigForValue';
import clearStoryEstimationsOfUser from './clearStoryEstimationsOfUser';

/**
 * The event reducer handles backend-event actions.
 * These are equivalent to the event handlers in the backend as they modify the room state.
 *
 * @param {object} state
 * @param {object} action
 * @returns {object} the modified state
 */
export default function eventReducer(state, action) {
  const {event} = action;

  // if we created a new room, and then joined, we don't have a roomId yet
  if (!state.roomId && event.name === 'joinedRoom') {
    state.roomId = event.roomId;
  }

  // Events from other rooms do not affect us (backend should not send such events in the first place)
  if (state.roomId !== event.roomId) {
    log.warn(
      `Event with different roomId received. localRoomId=${state.roomId}, eventRoomId=${event.roomId} (${event.name})`
    );
    return state;
  }

  const matchingHandler = eventActionHandlers[action.type];
  if (!matchingHandler) {
    log.warn('No matching backend-event handler for', action);
    return state;
  }

  let modifiedState = matchingHandler.fn(state, event.payload, event) || state;
  modifiedState = updateActionLog(matchingHandler.log, state, modifiedState, event);
  return modifiedState;
}

/**
 * adds a log message for a backend event to the state.
 *
 * @param {undefined | string | function} logObject defined in event handlers.
 *         If this is a function: username, eventPayload, oldState and newState will be passed.
 *         The function can return undefined or empty string. then no logEntry will be added
 * @param {object} oldState The state before the action was reduced
 * @param {object} modifiedState The state after the action was reduced
 * @param {object} event
 * @returns {object} The new state containing updated actionLog
 */
function updateActionLog(logObject, oldState, modifiedState, event) {
  if (!logObject) {
    return modifiedState;
  }

  const matchingUser = modifiedState.users && modifiedState.users[event.userId];
  const username = matchingUser ? matchingUser.username || '' : '';
  const message =
    typeof logObject === 'function'
      ? logObject(username, event.payload, oldState, modifiedState, event)
      : logObject;

  if (!message) {
    return modifiedState;
  }

  return {
    ...modifiedState,
    actionLog: [
      {
        tstamp: new Date(),
        message
      },
      ...(modifiedState.actionLog || [])
    ]
  };
}

/**
 * Map of event handlers.
 *
 * Defines the modification (application/reduction) a backend event performs on our state.
 * Also defines an optional log function or string (this is separated intentionally - even though it is technically also a modification to the state).
 *
 * TODO:  decide/discuss whether we should split these up into separate files (similar to backend)
 */
const eventActionHandlers = {
  /**
   * If the user joins a room that does not yet exist, it is created by the backend.
   * It will be followed by a "joinedRoom" event.
   */
  [EVENT_ACTION_TYPES.roomCreated]: {
    fn: (state) => state,
    log: (username, payload) => `Room "${payload.id}" created`
  },

  /**
   * A user joined the room. This can be either your own user or someone else joined the room.
   */
  [EVENT_ACTION_TYPES.joinedRoom]: {
    fn: (state, payload, event) => {
      if (state.userId) {
        // if our client state has already a userId set, this event indicates that someone else joined
        const modifiedUsers = {...state.users};
        modifiedUsers[event.userId] = payload.users[event.userId];
        return {
          ...state,
          users: modifiedUsers
        };
      } else {
        // you joined

        // set the page title
        document.title = `PoinZ - ${event.roomId}`;

        clientSettingsStore.setPresetUserId(event.userId);

        // server sends current room state (users, stories, etc.)
        return {
          ...state,
          roomId: event.roomId,
          userId: event.userId,
          selectedStory: payload.selectedStory,
          users: payload.users || {},
          stories: payload.stories || {}
        };
      }
    },
    log: (username, payload, oldState, newState, event) => {
      const youJoined = !oldState.userId;

      if (youJoined) {
        return `You joined room "${newState.roomId}"`;
      }

      return `User ${newState.users[event.userId].username || ''} joined`; // cannot directly use parameter "username". event is not yet reduced.
    }
  },

  /**
   * A user left the room. This can be either your own user. Or someone else left the room.
   */
  [EVENT_ACTION_TYPES.leftRoom]: {
    fn: (state, payload, event) => {
      // If your user (in this or in another browser) left the room
      if (state.userId === event.userId) {
        document.title = 'PoinZ';
        return {...initialState()};
      }

      // If someone else left the room
      const modifiedStories = clearStoryEstimationsOfUser(state.stories, event.userId);
      const modifiedUsers = {...state.users};
      delete modifiedUsers[event.userId];

      return {
        ...state,
        stories: modifiedStories,
        users: modifiedUsers
      };
    },
    log: (username, payload, oldState, newState, event) =>
      `User ${oldState.users[event.userId].username} left the room`
  },

  /**
   * A disconnected user was kicked from the room.
   */
  [EVENT_ACTION_TYPES.kicked]: {
    fn: (state, payload) => {
      // We need to take the userId from the payload (the user that was kicked, not the "kicking" user)
      const modifiedStories = clearStoryEstimationsOfUser(state.stories, payload.userId);
      const modifiedUsers = {...state.users};
      delete modifiedUsers[payload.userId];

      return {
        ...state,
        stories: modifiedStories,
        users: modifiedUsers
      };
    },
    log: (username, payload, oldState, modifiedState, event) =>
      `User "${oldState.users[event.userId].username}" was kicked from the room by user "${
        oldState.users[event.userId].username
      }"`
  },

  /**
   * A user in the room lost the connection to the server.
   */
  [EVENT_ACTION_TYPES.connectionLost]: {
    fn: (state, payload, event) => {
      if (!state.users || !state.users[event.userId]) {
        return state;
      }

      return {
        ...state,
        users: {
          ...state.users,
          [event.userId]: {
            ...state.users[event.userId],
            disconnected: true
          }
        }
      };
    },
    log: (username) => `${username} lost the connection`
  },

  [EVENT_ACTION_TYPES.storyAdded]: {
    fn: (state, payload) => {
      const modifiedStories = {...state.stories};
      modifiedStories[payload.id] = payload;
      return {
        ...state,
        stories: modifiedStories
      };
    },
    log: (username, payload) => `${username} added new story "${payload.title}"`
  },

  [EVENT_ACTION_TYPES.storyChanged]: {
    fn: (state, payload) => {
      const modifiedStory = {
        ...state.stories[payload.storyId],
        title: payload.title,
        description: payload.description,
        editMode: false
      };

      return {...state, stories: {...state.stories, [payload.storyId]: modifiedStory}};
    },
    log: (username, payload) => `${username} changed story "${payload.title}"`
  },

  [EVENT_ACTION_TYPES.storyDeleted]: {
    fn: (state, payload) => {
      const modifiedStories = {...state.stories};
      delete modifiedStories[payload.storyId];

      return {
        ...state,
        stories: modifiedStories
      };
    },
    log: (username, payload) => `${username} deleted story "${payload.title}"`
  },

  /**
   * the selected story was set (i.e. the one that can be currently estimated by the team)
   */
  [EVENT_ACTION_TYPES.storySelected]: {
    fn: (state, payload) => ({...state, selectedStory: payload.storyId}),
    log: (username, payload, oldState, newState) =>
      `${username} selected current story "${newState.stories[payload.storyId].title}"`
  },

  [EVENT_ACTION_TYPES.usernameSet]: {
    fn: (state, payload, event) => {
      const isOwnUser = state.userId === event.userId;

      if (isOwnUser) {
        clientSettingsStore.setPresetUsername(payload.username);
      }

      const modifiedUsers = {
        ...state.users,
        [event.userId]: {...state.users[event.userId], username: payload.username}
      };
      return {
        ...state,
        users: modifiedUsers,
        presetUsername: isOwnUser ? payload.username : state.presetUsername
      };
    },
    log: (username, payload, oldState, newState, event) => {
      const oldUsername = oldState.users[event.userId].username;
      const newUsername = payload.username;

      if (oldUsername && oldUsername !== newUsername) {
        return `"${oldState.users[event.userId].username}" is now called "${newUsername}"`;
      }
    }
  },

  [EVENT_ACTION_TYPES.emailSet]: {
    fn: (state, payload, event) => {
      const isOwnUser = state.userId === event.userId;

      if (isOwnUser) {
        clientSettingsStore.setPresetEmail(payload.email);
      }

      return {
        ...state,
        users: {
          ...state.users,
          [event.userId]: {...state.users[event.userId], email: payload.email}
        },
        presetEmail: isOwnUser ? payload.email : state.presetEmail
      };
    },
    log: (username, payload, oldState, newState, event) =>
      `${oldState.users[event.userId].username} set his/her email address`
  },

  /**
   * user was excluded from estimations (flag for a user was set / toggled on)
   */
  [EVENT_ACTION_TYPES.excludedFromEstimations]: {
    fn: (state, payload, event) => ({
      ...state,
      users: {
        ...state.users,
        [event.userId]: {...state.users[event.userId], excluded: true}
      }
    }),
    log: (username) => `${username} is now excluded from estimations`
  },

  /**
   * user was included in estimations (flag for a user was unset / toggled off)
   */
  [EVENT_ACTION_TYPES.includedInEstimations]: {
    fn: (state, payload, event) => ({
      ...state,
      users: {
        ...state.users,
        [event.userId]: {...state.users[event.userId], excluded: false}
      }
    }),
    log: (username) => `${username} is no longer excluded from estimations`
  },

  [EVENT_ACTION_TYPES.storyEstimateGiven]: {
    fn: (state, payload, event) => ({
      ...state,
      stories: {
        ...state.stories,
        [payload.storyId]: {
          ...state.stories[payload.storyId],
          estimations: {
            ...state.stories[payload.storyId].estimations,
            [event.userId]: payload.value
          }
        }
      }
    })
    // do not log -> if user is uncertain and switches between cards -> gives hints to other colleagues
  },

  [EVENT_ACTION_TYPES.consensusAchieved]: {
    fn: (state, payload) => ({
      ...state,
      stories: {
        ...state.stories,
        [payload.storyId]: {
          ...state.stories[payload.storyId],
          consensus: payload.value
        }
      }
    }),
    log: (username, eventPayload, oldState, modifiedState) => {
      const matchingCardConfig = getCardConfigForValue(
        oldState.cardConfig,
        modifiedState.stories[eventPayload.storyId].consensus
      );
      return `Consensus achieved for story "${
        modifiedState.stories[eventPayload.storyId].title
      }": ${matchingCardConfig ? matchingCardConfig.label : '-'}`;
    }
  },

  [EVENT_ACTION_TYPES.storyEstimateCleared]: {
    fn: (state, payload, event) => {
      const modifiedEstimations = {...state.stories[payload.storyId].estimations};
      delete modifiedEstimations[event.userId];

      return {
        ...state,
        stories: {
          ...state.stories,
          [payload.storyId]: {
            ...state.stories[payload.storyId],
            estimations: modifiedEstimations
          }
        }
      };
    }
    // do not log -> if user is uncertain and switches between cards -> gives hints to other colleagues
  },

  [EVENT_ACTION_TYPES.revealed]: {
    fn: (state, payload) => ({
      ...state,
      stories: {
        ...state.stories,
        [payload.storyId]: {...state.stories[payload.storyId], revealed: true}
      }
    }),
    log: (username, payload, oldState, modifiedState) =>
      payload.manually
        ? `${username} manually revealed estimates for story "${
            modifiedState.stories[payload.storyId].title
          }"`
        : `Estimates were automatically revealed for story "${
            modifiedState.stories[payload.storyId].title
          }"`
  },

  [EVENT_ACTION_TYPES.newEstimationRoundStarted]: {
    fn: (state, payload) => ({
      ...state,
      stories: {
        ...state.stories,
        [payload.storyId]: {
          ...state.stories[payload.storyId],
          estimations: {},
          revealed: false,
          consensus: undefined
        }
      }
    }),
    log: (username, payload, oldState, modifiedState) =>
      `${username} started a new estimation round for story "${
        modifiedState.stories[payload.storyId].title
      }"`
  },

  [EVENT_ACTION_TYPES.commandRejected]: {
    fn: (state, payload, event) => log.error(event),
    log: (username, payload) => `An error occurred: ${payload.reason}`
  }
};
