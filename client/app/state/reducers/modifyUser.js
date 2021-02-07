/**
 * Modify one user in the state
 *
 * @param state
 * @param userId
 * @param {function} modifier Will be invoked with the matching user from the state (which can be undefined, if no such user is in the state)
 */
export default function modifyUser(state, userId, modifier) {
  const modifiedUser = modifier(state.users[userId]);

  return {
    ...state,
    users: {
      ...state.users,
      [userId]: modifiedUser
    }
  };
}
