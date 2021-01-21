/**
 * A room was created. Creates a new default room object
 * @param room
 */
const roomCreatedEventHandler = (room, eventPayload) => {
  const roomObject = {
    id: room.id,
    users: [],
    stories: [],
    created: Date.now(),
    autoReveal: true
  };

  if (eventPayload.password) {
    roomObject.password = eventPayload.password;
  }

  return roomObject;
};

export default roomCreatedEventHandler;
