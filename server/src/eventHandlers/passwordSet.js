/**
 * user did set new password for room
 */
const passwordSetEventHandler = (room, eventPayload) => {
  return {
    ...room,
    password: {
      hash: eventPayload.password.hash,
      salt: eventPayload.password.salt
    }
  };
};

export default passwordSetEventHandler;
