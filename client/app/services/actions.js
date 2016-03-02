import {
  JOIN_ROOM,
  ADD_STORY,
  SELECT_STORY,
  GIVE_STORY_ESTIMATE,
  NEW_ESTIMATION_ROUND,
  REVEAL, SET_USERNAME,
  SET_VISITOR,
  LEAVE_ROOM,
  TOGGLE_BACKLOG,
  TOGGLE_USER_MENU
} from './actionTypes';


// actions that are triggered from our views
// these often trigger commands to the backend during reduction
// still implemented as redux actions -> views have a consistent api & we could store some information on the client
// when sending commands
export function joinRoom(roomId) {
  return {type: JOIN_ROOM, command: {roomId}};
}
export function addStory(storyTitle, storyDescription) {
  return {type: ADD_STORY, command: {title: storyTitle, description: storyDescription}};
}
export function selectStory(storyId) {
  return {type: SELECT_STORY, command: {storyId}};
}
export function giveStoryEstimate(storyId, value) {
  return {type: GIVE_STORY_ESTIMATE, command: {storyId, value}};
}
export function newEstimationRound(storyId) {
  return {type: NEW_ESTIMATION_ROUND, command: {storyId}};
}
export function reveal(storyId) {
  return {type: REVEAL, command: {storyId}};
}
export function setUsername(username) {
  return {type: SET_USERNAME, command: {username}};
}
export function setVisitor(isVisitor) {
  return {type: SET_VISITOR, command: {isVisitor}};
}
export function leaveRoom() {
  return {type: LEAVE_ROOM, command: {}};
}

// ui-only actions (client-side application state)
export function toggleBacklog() {
  return {type: TOGGLE_BACKLOG};
}
export function toggleUserMenu() {
  return {type: TOGGLE_USER_MENU};
}

