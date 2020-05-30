import Immutable from 'immutable';

// here we create the room object
const roomCreatedEventHandler = (room, eventPayload) =>
  Immutable.fromJS({
    id: eventPayload.id,
    users: {},
    stories: {},
    alias: eventPayload.alias,
    created: new Date().getTime()
  });

export default roomCreatedEventHandler;
