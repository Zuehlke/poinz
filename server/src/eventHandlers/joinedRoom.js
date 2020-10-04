/**
 * Adds user object with given userId to "users" list on room
 */
const joinedRoomEventHandler = (room, eventPayload, userId) => {
  const modifiedUsers = {
    ...room.users,
    [userId]: {id: userId}
  };
  return {
    ...room,
    users: modifiedUsers
  };
};

export default joinedRoomEventHandler;
