import * as types from './actionTypes'

// actions that are triggered from our views (these might also trigger commands to the backend during reduction)
export function joinRoom(roomId, username) {
  return {type: types.JOIN_ROOM, roomId, username};
}

export function addStory(storyTitle, storyDescription) {
  return {type: types.ADD_STORY, title: storyTitle, description: storyDescription};
}

export function selectStory(storyId) {
  return {type: types.SELECT_STORY, storyId};
}

export function giveStoryEstimate(storyId, value) {
  return {type: types.GIVE_STORY_ESTIMATE, storyId, value};
}


// redux actions for incoming backend events (these usually update our client state during reduction)
export function roomCreated(event) {
  return {type: types.ROOM_CREATED, event};
}
export function joinedRoom(event) {
  return {type: types.JOINED_ROOM, event};
}
export function leftRoom(event) {
  return {type: types.LEFT_ROOM, event};
}
export function commandRejected(event) {
  return {type: types.COMMAND_REJECTED, event};
}
export function storyAdded(event) {
  return {type: types.STORY_ADDED, event};
}
export function storySelected(event) {
  return {type: types.STORY_SELECTED, event};
}
export function usernameSet(event) {
  return {type: types.USERNAME_SET, event};
}
export function storyEstimateGiven(event) {
  return {type: types.STORY_ESTIMATE_GIVEN, event};
}
export function storyEstimateCleared(event) {
  return {type: types.STORY_ESTIMATE_CLEARED, event};
}
export function moderatorSet(event) {
  return {type: types.MODERATOR_SET, event};
}
export function allEstimatesGiven(event) {
  return {type: types.ALL_ESTIMATES_GIVEN, event};
}
