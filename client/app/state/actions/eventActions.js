import log from 'loglevel';

import history from '../getBrowserHistory';
import {getRoom} from '../../services/restApi/roomService';
import {getPendingJoinCommandId} from '../commandTracking/commandTrackingSelectors';
import {getRoomId} from '../room/roomSelectors';
import {getOwnUserToken} from '../users/usersSelectors';

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
  passwordSet: 'PASSWORD_SET',
  passwordCleared: 'PASSWORD_CLEARED',
  roomConfigSet: 'ROOM_CONFIG_SET',
  tokenIssued: 'TOKEN_ISSUED'
};

/* ACTION CREATORS */

/**
 * Our client received an event over the websocket, which is now transformed into two redux actions.
 * One generic "EVENT_RECEIVED" action and one specific action. The type of the specific redux action will match the name of the event.
 *
 * @param {object} event
 */
export const eventReceived = (event) => (dispatch, getState) => {
  const state = getState();
  if (!EVENT_ACTION_TYPES[event.name]) {
    log.error(`Unknown incoming event type ${event.name}. Will ignore!`);
    return;
  }

  if (log.getLevel() <= log.levels.DEBUG && event.roomId !== getRoomId(state)) {
    log.debug(
      `Received event "${event.name}" has roomId=${event.roomId}. Our state has roomId=${getRoomId(
        state
      )}`
    );
  }

  dispatchGenericEvent(dispatch, event);

  dispatchSpecificEvent(dispatch, event, state);

  if (EVENT_ACTION_TYPES[event.name] === EVENT_ACTION_TYPES.joinedRoom) {
    history.push('/' + event.roomId);
  }

  if (EVENT_ACTION_TYPES[event.name] === EVENT_ACTION_TYPES.commandRejected) {
    tryToRecoverOnRejection(event, dispatch, getState);
  }
};

/**
 * Dispatches a generic "EVENT_RECEIVED"  redux action
 * @param dispatch
 * @param event
 */
const dispatchGenericEvent = (dispatch, event) => {
  dispatch({
    type: EVENT_RECEIVED,
    eventName: event.name,
    correlationId: event.correlationId
  });
};

/**
 * Dispatches a specific redux action (see EVENT_ACTION_TYPES)
 *
 * @param dispatch
 * @param event
 * @param state
 */
const dispatchSpecificEvent = (dispatch, event, state) => {
  const type = EVENT_ACTION_TYPES[event.name];
  const specificEventAction = {
    event,
    type
  };
  const isJoinedRoomEvent = type === EVENT_ACTION_TYPES.joinedRoom;
  if (isJoinedRoomEvent && getPendingJoinCommandId(state) === event.correlationId) {
    specificEventAction.ourJoin = true;
  }
  dispatch(specificEventAction);
};

/**
 * If a command failed, the server sends a "commandRejected" event.
 * From some rejections, we might be able to recover by reloading the room state from the backend.
 * Obviously there are situations where there is a mismatch between server and client state.
 */
const tryToRecoverOnRejection = (event, dispatch, getState) => {
  const state = getState();
  if (!event.payload || !event.payload.command || !getRoomId(state)) {
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
    getRoom(getRoomId(state), getOwnUserToken(state)).then((data) =>
      dispatch({
        type: ROOM_STATE_FETCHED,
        room: data
      })
    );
  }
};
