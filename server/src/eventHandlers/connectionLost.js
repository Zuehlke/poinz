/**
 * Marks user as "disconnected".
 */
const connectionLostEventHandler = (room, eventPayload, userId) => {
  const matchingUser = room.users && room.users[userId];
  if (!matchingUser) {
    return {...room};
  }

  const modifiedUsers = {
    ...room.users,
    [userId]: {
      ...matchingUser,
      disconnected: true
    }
  };

  return {
    ...room,
    users: modifiedUsers
  };
};

export default connectionLostEventHandler;
