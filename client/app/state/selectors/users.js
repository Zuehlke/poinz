import {createSelector} from 'reselect';

const getOwnUserId = (state) => state.userId;
const getUsers = (state) => state.users;

/**
 * Returns the number of users in our room.
 */
export const getUserCount = createSelector([getUsers], (users) => {
  if (users) {
    return Object.keys(users).length;
  }
  return 0;
});

export const getOwnUsername = createSelector([getUsers, getOwnUserId], (users, ownUserId) =>
  users && users[ownUserId] ? users[ownUserId].username : '-'
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
