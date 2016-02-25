/**
 * Action types for commands
 */
export const JOIN_ROOM = 'JOIN_ROOM';
export const ADD_STORY = 'ADD_STORY';
export const SELECT_STORY = 'SELECT_STORY';
export const GIVE_STORY_ESTIMATE = 'GIVE_STORY_ESTIMATE';
export const NEW_ESTIMATION_ROUND = 'NEW_ESTIMATION_ROUND';
export const SET_USERNAME = 'SET_USERNAME';
export const LEAVE_ROOM = 'LEAVE_ROOM';
export const TOGGLE_VISITOR = 'TOGGLE_VISITOR';

/**
 *  UI-only
 */
export const TOGGLE_BACKLOG = 'TOGGLE_BACKLOG';
export const TOGGLE_USER_MENU = 'TOGGLE_USER_MENU';

/**
 * Action types for events
 */
export const EVENT_ACTION_TYPES = {
  roomCreated: 'ROOM_CREATED',
  joinedRoom: 'JOINED_ROOM',
  leftRoom: 'LEFT_ROOM',
  connectionLost: 'CONNECTION_LOST',
  commandRejected: 'COMMAND_REJECTED',
  storyAdded: 'STORY_ADDED',
  storySelected: 'STORY_SELECTED',
  usernameSet: 'USERNAME_SET',
  storyEstimateGiven: 'STORY_ESTIMATE_GIVEN',
  storyEstimateCleared: 'STORY_ESTIMATE_CLEARED',
  allEstimatesGiven: 'ALL_ESTIMATES_GIVEN',
  newEstimationRoundStarted: 'NEW_ESTIMATION_ROUND_STARTED',
  visitorSet: 'VISITOR_SET',
  visitorUnset: 'VISITOR_UNSET'
};
