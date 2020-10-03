import {createSelector} from 'reselect';

const getStories = (state) => state.stories;
const getOwnUserId = (state) => state.userId;
const getSelectedStoryId = (state) => state.selectedStory;
const getEstimations = (state) => state.estimations;
const getPendingCmds = (state) => state.pendingCommands;
const getUsers = (state) => state.users;

/**
 * Returns active stories as array. Never returns undefined.
 */
export const getActiveStories = createSelector([getStories], (stories) =>
  stories ? Object.values(stories).filter((s) => !s.trashed) : []
);

/**
 * Returns trashed stories as array. Never returns undefined.
 */
export const getTrashedStories = createSelector([getStories], (stories) =>
  stories ? Object.values(stories).filter((s) => s.trashed) : []
);

/**
 * Returns own estimate for the currently selectedStory. Can return undefined.
 */
export const getOwnEstimate = createSelector(
  [getSelectedStoryId, getEstimations, getOwnUserId],
  (selectedStoryId, estimations, ownUserId) =>
    estimations && estimations[selectedStoryId] && estimations[selectedStoryId][ownUserId]
);

export const getOwnUsername = createSelector([getUsers, getOwnUserId], (users, ownUserId) =>
  users && users[ownUserId] ? users[ownUserId].username : '-'
);

// Returns pending commands as array. Never returns undefined.
const getPendingCommands = createSelector([getPendingCmds], (pendingCmds) =>
  Object.values(pendingCmds || {})
);

const myUserFirstUserComparator = (ownUserId, userA, userB) => {
  if (userA.id === ownUserId) {
    return -1;
  }
  if (userB.id === ownUserId) {
    return 1;
  }

  if (userA.username && userB.username) {
    return userA.username.localeCompare(userB.username);
  }

  if (userA.username) {
    return -1;
  }
  if (userB.username) {
    return 1;
  }
};

/**
 * Returns true if our room contains stories and a story is selected.
 * False otherwise
 */
export const isAStorySelected = createSelector(
  [getSelectedStoryId, getStories],
  (selectedStoryId, stories) => stories && selectedStoryId && !!stories[selectedStoryId]
);

/**
 * Returns an array of all users in our room, specially sorted: my own user always first.
 * All others sorted alphabetically (username)
 */
export const getSortedUserArray = createSelector([getUsers, getOwnUserId], (users, ownUserId) => {
  const userArray = Object.values(users || {});
  userArray.sort(myUserFirstUserComparator.bind(undefined, ownUserId));
  return userArray;
});

/**
 * Returns true if this card (specified by its value) should be shown "waiting".
 * (either because you just estimated or cleared your estimation)
 */
export const isThisCardWaiting = (state, cardValue, ownEstimate) => {
  const pendingEstimationCommand = getMatchingPendingCommand(state, 'giveStoryEstimate');
  const estimationWaiting = pendingEstimationCommand
    ? pendingEstimationCommand.payload.value
    : undefined;
  const hasPendingClearCommand = hasMatchingPendingCommand(state, 'clearStoryEstimate');

  return cardValue === estimationWaiting || (hasPendingClearCommand && cardValue === ownEstimate);
};

/**
 * Returns true if this story (in the backlog) (specified by its id) should be shown "waiting".
 * (either because you selected it or trashed it)
 */
export const isThisStoryWaiting = (state, storyId) => {
  const pendingSelectCommands = getAllMatchingPendingCommands(state, 'selectStory');
  const pendingTrashCommand = getAllMatchingPendingCommands(state, 'trashStory');

  return !!(
    pendingSelectCommands.find((cmd) => cmd.payload.storyId === storyId) ||
    pendingTrashCommand.find((cmd) => cmd.payload.storyId === storyId)
  );
};

/**
 * Returns true if this story (in edit mode in the backlog) (specified by its id) should be shown "waiting".
 * (because you saved your changes (= sent changeStory command))
 */
export const isThisStoryEditFormWaiting = (state, storyId) => {
  const pendingChangeCommands = getAllMatchingPendingCommands(state, 'changeStory');
  return !!pendingChangeCommands.find((cmd) => cmd.payload.storyId === storyId);
};

/**
 * Returns true if the client is currently waiting for a (event) response to a sent command that matches the given commandName
 */
export const hasMatchingPendingCommand = (state, commandName) =>
  !!getMatchingPendingCommand(state, commandName);

/**
 * Returns a matching pending command that was sent by this client (the client is currently waiting for a (event) response).
 * Can also return undefined
 */
export const getMatchingPendingCommand = (state, commandName) =>
  getPendingCommands(state).find((cmd) => cmd.name === commandName);

/**
 * Returns all matching pending commands for the given commandName.
 * Can return an empty array. never returns undefined.
 */
export const getAllMatchingPendingCommands = (state, commandName) =>
  getPendingCommands(state).filter((cmd) => cmd.name === commandName);
