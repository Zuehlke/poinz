/**
 * user did set new password for room
 */
const passwordSetEventHandler = (room, eventPayload, userId, modifyEventPayload) => {
  const modifiedRoom = {
    ...room,
    password: eventPayload.password
  };

  modifyEventPayload({}); // clear password from event payload. we don't want to send it to clients

  return modifiedRoom;
};

export default passwordSetEventHandler;
