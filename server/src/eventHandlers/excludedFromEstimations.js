/**
 * Sets "excluded" flag on user to true
 */
const excludedFromEstimationsEventHandler = (room, eventPayload, userId) => {
  const modifiedUsers = {
    ...room.users,
    [userId]: {
      ...room.users[userId],
      excluded: true
    }
  };

  return {
    ...room,
    users: modifiedUsers
  };
};

export default excludedFromEstimationsEventHandler;
