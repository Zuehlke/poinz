import defaultCardConfig from '../defaultCardConfig';

/**
 * A room was created. Creates a new default room object
 * @param room
 */
const roomCreatedEventHandler = (room) => ({
  id: room.id,
  users: {},
  stories: {},
  cardConfig: defaultCardConfig,
  created: Date.now()
});

export default roomCreatedEventHandler;
