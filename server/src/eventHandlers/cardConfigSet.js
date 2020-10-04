/**
 * user did set custom cardConfig on room
 */
const cardConfigSetEventHandler = (room, eventPayload) => ({
  ...room,
  cardConfig: eventPayload.cardConfig
});

export default cardConfigSetEventHandler;
