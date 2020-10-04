/**
 * user set his name
 */
const usernameSetEventHandler = (room, eventPayload, userId) => {
  const modifiedUsers = {
    ...room.users,
    [userId]: {
      ...room.users[userId],
      username: eventPayload.username
    }
  };

  return {
    ...room,
    users: modifiedUsers
  };
};

export default usernameSetEventHandler;
