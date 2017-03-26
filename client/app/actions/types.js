/**
 *  UI-only
 */
export const TOGGLE_BACKLOG = 'TOGGLE_BACKLOG'; // toggles the visibility of the story backlog
export const TOGGLE_USER_MENU = 'TOGGLE_USER_MENU'; // toggles the visibility of the user menu (settings)
export const TOGGLE_LOG = 'TOGGLE_LOG'; // toggles the visibility of the event log
export const EDIT_STORY = 'EDIT_STORY';
export const CANCEL_EDIT_STORY = 'CANCEL_EDIT_STORY';
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const STATUS_FETCHED = 'STATUS_FETCHED';


/**
 * Action types for backend events
 */
export const EVENT_ACTION_TYPES = {
  roomCreated: 'ROOM_CREATED',
  joinedRoom: 'JOINED_ROOM',
  leftRoom: 'LEFT_ROOM',
  kicked: 'KICKED',
  connectionLost: 'CONNECTION_LOST',
  commandRejected: 'COMMAND_REJECTED',
  storyAdded: 'STORY_ADDED',
  storySelected: 'STORY_SELECTED',
  usernameSet: 'USERNAME_SET',
  emailSet: 'EMAIL_SET',
  storyEstimateGiven: 'STORY_ESTIMATE_GIVEN',
  storyEstimateCleared: 'STORY_ESTIMATE_CLEARED',
  revealed: 'REVEALED',
  newEstimationRoundStarted: 'NEW_ESTIMATION_ROUND_STARTED',
  visitorSet: 'VISITOR_SET',
  visitorUnset: 'VISITOR_UNSET',
  storyChanged: 'STORY_CHANGED',
  storyDeleted: 'STORY_DELETED'
};


/** various **/
export const COMMAND_SENT = 'COMMAND_SENT';
export const EVENT_RECEIVED = 'EVENT_RECEIVED';
export const SET_ROOMID = 'SET_ROOMID';
