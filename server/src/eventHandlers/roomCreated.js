import Immutable from 'immutable';

/**
 * A room was created. Creates a new default room object
 * @param room
 * @param eventPayload
 * @return {*}
 */
const roomCreatedEventHandler = (room, eventPayload) =>
  Immutable.fromJS({
    id: eventPayload.id,
    users: {},
    stories: {},
    alias: eventPayload.alias,
    created: new Date().getTime()
  });

export default roomCreatedEventHandler;
