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
export const TOGGLE_MENU = 'TOGGLE_MENU';

/**
 * Action types for events
 */
export const ROOM_CREATED = 'ROOM_CREATED';
export const JOINED_ROOM = 'JOINED_ROOM';
export const LEFT_ROOM = 'LEFT_ROOM';
export const CONNECTION_LOST = 'CONNECTION_LOST';
export const COMMAND_REJECTED = 'COMMAND_REJECTED';
export const STORY_ADDED = 'STORY_ADDED';
export const STORY_SELECTED = 'STORY_SELECTED';
export const USERNAME_SET = 'USERNAME_SET';
export const STORY_ESTIMATE_GIVEN = 'STORY_ESTIMATE_GIVEN';
export const STORY_ESTIMATE_CLEARED = 'STORY_ESTIMATE_CLEARED';
export const ALL_ESTIMATES_GIVEN = 'ALL_ESTIMATES_GIVEN';
export const NEW_ESTIMATION_ROUND_STARTED = 'NEW_ESTIMATION_ROUND_STARTED';
export const VISITOR_SET = 'VISITOR_SET';
export const VISITOR_UNSET = 'VISITOR_UNSET';
