import Immutable from 'immutable';
import defaultCardConfig from '../defaultCardConfig';

/**
 * A room was created. Creates a new default room object
 * @param room
 */
const roomCreatedEventHandler = (room) =>
  Immutable.fromJS({
    id: room.get('id'),
    users: {},
    stories: {},
    cardConfig: defaultCardConfig,
    created: Date.now()
  });

export default roomCreatedEventHandler;
