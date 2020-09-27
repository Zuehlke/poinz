/**
 * user did set custom cardConfig on room
 */
const cardConfigSetEventHandler = (room, eventPayload) =>
  room.set('cardConfig', eventPayload.cardConfig);

export default cardConfigSetEventHandler;
