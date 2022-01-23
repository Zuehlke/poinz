import {formatTime} from '../../services/timeUtil';
import uuid from '../../services/uuid';

import {EVENT_ACTION_TYPES} from '../actions/eventActions';
import {getMatchingCardConfig, getRoomId} from '../room/roomSelectors';
import {getStoryById} from '../stories/storiesSelectors';
import {getOwnUserId, getUsersById} from '../users/usersSelectors';

/*
 * will contain human readable "log messages" of actions (events) that did take place in the current room
 */
export const actionLogInitialState = [];

/**
 *
 * @param {object} state The WHOLE redux state. Already modified by other reducers...
 * @param action
 * @param {object} oldState The whole redux state before the current action modified it in any way
 * @return {object}
 */
export default function (state, action, oldState) {
  const {event} = action;
  if (!event) {
    return state;
  }

  const {payload} = event;
  const username = getUsername(state, event.userId);

  switch (action.type) {
    // joining / leaving / kicking
    case EVENT_ACTION_TYPES.roomCreated:
      return updateLogInState(`Room "${payload.id}" created`);
    case EVENT_ACTION_TYPES.joinedRoom: {
      const isOwnJoin = getOwnUserId(state) === event.userId;
      const message = isOwnJoin
        ? `You joined room "${getRoomId(state)}"`
        : `${username || 'New user'} joined`;

      if (isOwnJoin) {
        return {
          ...state,
          actionLog: [toLogItem(message)]
        };
      } else {
        return updateLogInState(message);
      }
    }
    case EVENT_ACTION_TYPES.leftRoom: {
      if (event.userId === getOwnUserId(oldState)) {
        return {
          ...state,
          actionLog: [toLogItem('You left the room')] // clear actionLog, just add our new item
        };
      } else {
        return updateLogInState(`${getUsername(oldState, event.userId)} left the room`);
      }
    }
    case EVENT_ACTION_TYPES.kicked:
      return updateLogInState(
        `${getUsername(oldState, payload.userId)} was kicked from the room by ${getUsername(
          oldState,
          event.userId
        )}`
      );
    case EVENT_ACTION_TYPES.connectionLost:
      return updateLogInState(`${username} lost the connection`);

    // users properties
    case EVENT_ACTION_TYPES.usernameSet: {
      const oldUsername = getUsersById(oldState)[event.userId].username;

      if (oldUsername && oldUsername !== username) {
        return updateLogInState(`"${oldUsername}" is now called "${username}"`);
      }

      if (!oldUsername && username) {
        // user set his username after first join, where user is in room, but username is not yet set (=undefined).
        return updateLogInState(`New user is now called "${username}"`);
      }
      return state;
    }
    case EVENT_ACTION_TYPES.emailSet:
      return updateLogInState(`${username} set his/her email address`);
    case EVENT_ACTION_TYPES.avatarSet:
      return updateLogInState(`${username} set his/her avatar`);
    case EVENT_ACTION_TYPES.excludedFromEstimations: {
      const isOwn = getOwnUserId(state) === payload.userId;
      if (isOwn) {
        return updateLogInState(
          `${username} excluded himself/herself from estimations (Spectator)`
        );
      } else {
        return updateLogInState(
          `${username} excluded ${getUsername(state, payload.userId)} from estimations (Spectator)`
        );
      }
    }
    case EVENT_ACTION_TYPES.includedInEstimations: {
      const isOwn = getOwnUserId(state) === payload.userId;
      if (isOwn) {
        return updateLogInState(
          `${username} included himself/herself in estimations (no longer a Spectator)`
        );
      } else {
        return updateLogInState(
          `${username} included ${getUsername(
            state,
            payload.userId
          )} in estimations (no longer a Spectator)`
        );
      }
    }

    // backlog modifications (stories added, changed, trashed, deleted)
    case EVENT_ACTION_TYPES.storyAdded:
      return updateLogInState(`${username} added new story "${payload.title}"`);
    case EVENT_ACTION_TYPES.storyChanged:
      return updateLogInState(`${username} changed story "${payload.title}"`);
    case EVENT_ACTION_TYPES.storyTrashed:
      return updateLogInState(
        `${username} moved story "${getStoryTitle(state, payload.storyId)}" to trash`
      );
    case EVENT_ACTION_TYPES.storyRestored:
      return updateLogInState(
        `${username} restored story "${getStoryTitle(state, payload.storyId)}" from trash`
      );
    case EVENT_ACTION_TYPES.storyDeleted:
      return updateLogInState(
        `${username} deleted story "${getStoryTitle(state, payload.storyId)}"`
      );
    case EVENT_ACTION_TYPES.storySelected: {
      const line = payload.storyId
        ? `${username} selected story "${getStoryTitle(state, payload.storyId)}" for estimation`
        : 'Currently no story is selected';
      return updateLogInState(line);
    }
    case EVENT_ACTION_TYPES.importFailed:
      return updateLogInState('CSV import failed. ' + payload.message);

    // estimating
    // storyEstimateGiven and storyEstimateCleared are not logged!
    // if user is uncertain and switches between cards -> gives hints to other colleagues
    case EVENT_ACTION_TYPES.consensusAchieved: {
      const matchingCardConfig = getMatchingCardConfig(state, payload.value);
      let message = `Consensus achieved for story "${getStoryTitle(state, payload.storyId)}": ${
        matchingCardConfig.label
      }`;

      if (payload.settled) {
        message = `${message} (${username} manually settled)`;
      }

      return updateLogInState(message);
    }
    case EVENT_ACTION_TYPES.revealed: {
      const storyTitle = getStoryTitle(state, payload.storyId);
      const message = payload.manually
        ? `${username} manually revealed estimates for story "${storyTitle}"`
        : `Estimates were automatically revealed for story "${storyTitle}"`;

      return updateLogInState(message);
    }
    case EVENT_ACTION_TYPES.newEstimationRoundStarted: {
      return updateLogInState(
        `${username} started a new estimation round for story "${getStoryTitle(
          state,
          payload.storyId
        )}"`
      );
    }

    // ROOM configuration
    case EVENT_ACTION_TYPES.cardConfigSet:
      return updateLogInState(`${username} set new custom card configuration for this room`);
    case EVENT_ACTION_TYPES.roomConfigSet: {
      const autoRevealOnOff = state.room.autoReveal ? 'on' : 'off';
      const confidenceOnOff = state.room.withConfidence ? 'on' : 'off';
      const url = state.room.issueTrackingUrl ? state.room.issueTrackingUrl : '-';

      return updateLogInState(
        `${username} set the room configuration: Auto Reveal is ${autoRevealOnOff}, Confidence is ${confidenceOnOff}, Issue Tracking URL is ${url}`
      );
    }
    case EVENT_ACTION_TYPES.passwordSet:
      return updateLogInState(`${username} set a password for this room`);
    case EVENT_ACTION_TYPES.passwordCleared:
      return updateLogInState(`${username} removed password protection for this room`);

    // command rejected
    case EVENT_ACTION_TYPES.commandRejected:
      return updateLogInState({
        message: `Command "${payload.command.name}" was not successful. \n ${payload.reason}`,
        isError: true
      });

    default:
      return state;
  }

  function toLogItem(logObject) {
    const newLogItem = {
      tstamp: formatTime(Date.now()),
      logId: uuid()
    };
    if (typeof logObject === 'string') {
      newLogItem.message = logObject;
    } else {
      newLogItem.message = logObject.message;
      newLogItem.isError = logObject.isError;
    }
    return newLogItem;
  }

  function updateLogInState(logObject) {
    return {
      ...state,
      actionLog: [toLogItem(logObject), ...state.actionLog]
    };
  }
}

function getUsername(state, userId) {
  if (
    state.users &&
    state.users.usersById &&
    state.users.usersById[userId] &&
    state.users.usersById[userId].username
  ) {
    return state.users.usersById[userId].username;
  } else {
    return 'New user';
  }
}

function getStoryTitle(state, storyId) {
  const matchingStory = getStoryById(state, storyId);
  if (matchingStory) {
    return matchingStory.title;
  } else {
    return 'Unknown Story';
  }
}
