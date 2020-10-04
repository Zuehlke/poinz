/**
 * user sets his avatar (number)
 */
const avatarSetEventHandler = (room, eventPayload, userId) => {
  const modifiedUsers = {
    ...room.users,
    [userId]: {
      ...room.users[userId],
      avatar: eventPayload.avatar
    }
  };

  return {
    ...room,
    users: modifiedUsers
  };
};

export default avatarSetEventHandler;
