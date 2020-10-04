/**
 * user set his email address
 */
const emailSetEventHandler = (room, eventPayload, userId) => {
  const modifiedUsers = {
    ...room.users,
    [userId]: {
      ...room.users[userId],
      email: eventPayload.email,
      emailHash: eventPayload.emailHash
    }
  };

  return {
    ...room,
    users: modifiedUsers
  };
};

export default emailSetEventHandler;
