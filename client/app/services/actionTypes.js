

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
  revealed: 'REVEALED',
  newEstimationRoundStarted: 'NEW_ESTIMATION_ROUND_STARTED',
  visitorSet: 'VISITOR_SET',
  visitorUnset: 'VISITOR_UNSET'
};


/** various **/
export const COMMAND_SENT = 'COMMAND_SENT';
export const EVENT_RECEIVED = 'EVENT_RECEIVED';
export const SET_ROOMID = 'SET_ROOMID';
