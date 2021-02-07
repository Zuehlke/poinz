import log from 'loglevel';

import history from '../../services/getBrowserHistory';
import {getRoom} from '../../services/restApi/roomService';

/* TYPES */
export const ROOM_STATE_FETCHED = 'ROOM_STATE_FETCHED';
export const EVENT_RECEIVED = 'EVENT_RECEIVED';

/* all action types for backend events  in one object for convenience */
export const EVENT_ACTION_TYPES = {
  roomCreated: 'ROOM_CREATED',
  joinedRoom: 'JOINED_ROOM',
  leftRoom: 'LEFT_ROOM',
  kicked: 'KICKED',
  connectionLost: 'CONNECTION_LOST',
  commandRejected: 'COMMAND_REJECTED',
  storyAdded: 'STORY_ADDED',
  storySelected: 'STORY_SELECTED',
  importFailed: 'IMPORT_FAILED',
  usernameSet: 'USERNAME_SET',
  emailSet: 'EMAIL_SET',
  avatarSet: 'AVATAR_SET',
  storyEstimateGiven: 'STORY_ESTIMATE_GIVEN',
  consensusAchieved: 'CONSENSUS_ACHIEVED',
  storyEstimateCleared: 'STORY_ESTIMATE_CLEARED',
  revealed: 'REVEALED',
  newEstimationRoundStarted: 'NEW_ESTIMATION_ROUND_STARTED',
  excludedFromEstimations: 'EXCLUDED_FROM_ESTM',
  includedInEstimations: 'INCLUDED_IN_ESTM',
  storyChanged: 'STORY_CHANGED',
  storyDeleted: 'STORY_DELETED',
  storyTrashed: 'STORY_TRASHED',
  storyRestored: 'STORY_RESTORED',
  cardConfigSet: 'CARD_CONFIG_SET',
  autoRevealOn: 'AUTO_REVEAL_ON',
  autoRevealOff: 'AUTO_REVEAL_OFF',
  passwordSet: 'PASSWORD_SET',
  passwordCleared: 'PASSWORD_CLEARED',
  tokenIssued: 'TOKEN_ISSUED'
};

/* ACTION CREATORS */

/**
 * Our client received an event over the websocket, which is now transformed into two redux actions.
 * One generic "EVENT_RECEIVED" action and one specific action, if the event is known (i.e. there exists a matching property on EVENT_ACTION_TYPES).
 * The type of the specific redux action will match the name of the event.
 *
 * @param {object} event
 */
export const eventReceived = (event) => (dispatch, getState) => {
  const matchingType = EVENT_ACTION_TYPES[event.name];
  if (!matchingType) {
    log.error(`Unknown incoming event type ${event.name}. Will not dispatch a specific action.`);
    return;
  }

  // dispatch generic "event_received" action
  dispatch({
    type: EVENT_RECEIVED,
    eventName: event.name,
    correlationId: event.correlationId
  });

  // dispatch the specific event action
  dispatch({
    event,
    type: matchingType
  });

  if (event.name === 'joinedRoom') {
    history.push('/' + event.roomId);
  }

  if (matchingType === EVENT_ACTION_TYPES.commandRejected) {
    tryToRecoverOnRejection(event, dispatch, getState);
  }
};

/**
 * If a command failed, the server sends a "commandRejected" event.
 * From some rejections, we might be able to recover by reloading the room state from the backend.
 * Obviously there are situations where there is a mismatch between server and client state.
 */
const tryToRecoverOnRejection = (event, dispatch, getState) => {
  const state = getState();
  if (!event.payload || !event.payload.command || !state.roomId) {
    return;
  }

  const failedCommandName = event.payload.command.name;

  if (
    failedCommandName === 'giveStoryEstimate' ||
    failedCommandName === 'clearStoryEstimate' ||
    failedCommandName === 'newEstimationRound' ||
    failedCommandName === 'reveal' ||
    failedCommandName === 'kick'
  ) {
    getRoom(state.roomId, state.userToken).then((data) =>
      dispatch({
        type: ROOM_STATE_FETCHED,
        room: data
      })
    );
  }
};
