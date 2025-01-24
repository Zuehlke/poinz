import {createSelector} from 'reselect';

export const getOwnUserId = (state) => state.users.ownUserId;
export const getOwnUserToken = (state) => state.users.ownUserToken;
export const getUsersById = (state) => state.users.usersById;

/**
 * Returns the number of users in our room.
 */
export const getUserCount = createSelector([getUsersById], (users) => {
  if (users) {
    return Object.keys(users).length;
  }
  return 0;
});

/**
 *
 */
export const getOwnUser = createSelector(
  [getUsersById, getOwnUserId],
  (users, ownUserId) => users[ownUserId]
);

/**
 * Returns an array of all users in our room, specially sorted: my own user always first.
 * All normal users sorted alphabetically (username)
 * All excluded users last
 */
export const getSortedUserArray = createSelector(
  [getUsersById, getOwnUserId],
  (users, ownUserId) => {
    const userArray = Object.values(users || {});
    userArray.sort(myUserFirstExcludedLast.bind(undefined, ownUserId));
    return userArray;
  }
);

const myUserFirstExcludedLast = (ownUserId, userA, userB) => {
  if (userA.id === ownUserId) {
    return -1;
  }
  if (userB.id === ownUserId) {
    return 1;
  }

  if (userA.excluded && !userB.excluded) {
    return 1;
  }

  if (userB.excluded && !userA.excluded) {
    return -1;
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
