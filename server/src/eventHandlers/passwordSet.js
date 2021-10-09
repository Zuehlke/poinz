/**
 * user did set new password for room
 */
const passwordSetEventHandler = (room, eventPayload) => {
  return {
    ...room,
    password: eventPayload.password
  };
};

export default passwordSetEventHandler;
