/**
 * Sets "excluded" flag on user to false
 */
const includedInEstimationsEventHandler = (room, eventPayload, userId) => {
  const modifiedUsers = {
    ...room.users,
    [userId]: {
      excluded: false
    }
  };

  return {
    ...room,
    users: modifiedUsers
  };
};

export default includedInEstimationsEventHandler;
