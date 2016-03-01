import * as types from './actionTypes';


// actions that are triggered from our views
// these often trigger commands to the backend during reduction
// still implemented as redux actions -> views have a consistent api & we could store some information on the client
// when sending commands
export function joinRoom(roomId) {
  return {type: types.JOIN_ROOM, command: {roomId}};
}
export function addStory(storyTitle, storyDescription) {
  return {type: types.ADD_STORY, command: {title: storyTitle, description: storyDescription}};
}
export function selectStory(storyId) {
  return {type: types.SELECT_STORY, command: {storyId}};
}
export function giveStoryEstimate(storyId, value) {
  return {type: types.GIVE_STORY_ESTIMATE, command: {storyId, value}};
}
export function newEstimationRound(storyId) {
  return {type: types.NEW_ESTIMATION_ROUND, command: {storyId}};
}
export function reveal(storyId) {
  return {type: types.REVEAL, command: {storyId}};
}
export function setUsername(username) {
  return {type: types.SET_USERNAME, command: {username}};
}
export function toggleVisitor() {
  return {type: types.TOGGLE_VISITOR, command: {}};
}
export function leaveRoom() {
  return {type: types.LEAVE_ROOM, command: {}};
}

// ui-only actions (client-side application state)
export function toggleBacklog() {
  return {type: types.TOGGLE_BACKLOG};
}
export function toggleUserMenu() {
  return {type: types.TOGGLE_USER_MENU};
}

