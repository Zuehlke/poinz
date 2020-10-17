/**
 * A room was created. Creates a new default room object
 * @param room
 */
const roomCreatedEventHandler = (room) => ({
  id: room.id,
  users: [],
  stories: [],
  created: Date.now()
});

export default roomCreatedEventHandler;
