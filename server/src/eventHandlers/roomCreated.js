import Immutable from 'immutable';

/**
 * A room was created. Creates a new default room object
 * @param room
 */
const roomCreatedEventHandler = (room) =>
  Immutable.fromJS({
    id: room.get('id'),
    users: {},
    stories: {},
    created: Date.now()
  });

export default roomCreatedEventHandler;
