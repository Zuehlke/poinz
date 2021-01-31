/**
 * delete the matching user in the state
 *
 * @param state
 * @param userId
 */
export default function deleteUser(state, userId) {
  const modifiedUsers = {...state.users};
  delete modifiedUsers[userId];

  return {
    ...state,
    users: modifiedUsers
  };
}
