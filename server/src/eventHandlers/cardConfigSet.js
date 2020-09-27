import Immutable from 'immutable';

/**
 * user did set custom cardConfig on room
 */
const cardConfigSetEventHandler = (room, eventPayload) =>
  room.set('cardConfig', Immutable.fromJS(eventPayload.cardConfig));

export default cardConfigSetEventHandler;
