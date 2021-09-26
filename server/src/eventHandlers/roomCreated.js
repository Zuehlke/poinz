/**
 * A room was created. Creates a new default room object
 * @param room
 * @param eventPayload
 * @param userId
 * @param {function} modifyEventPayload
 */
function roomCreatedEventHandler(room, eventPayload, userId, modifyEventPayload) {
  const roomObject = {
    id: room.id,
    users: [],
    stories: [],
    created: Date.now(),
    autoReveal: true,
    withConfidence: false
  };

  if (eventPayload.password) {
    roomObject.password = eventPayload.password;
  }

  modifyEventPayload({}); // clear password from event payload. we don't want to send it to clients

  return roomObject;
}

export default roomCreatedEventHandler;
