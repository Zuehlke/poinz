import Promise from 'bluebird';
import Immutable from 'immutable';

export default {
  assertValidEvent,
  newMockRoomsStore
};

function assertValidEvent(actualEvent, correlationId, roomId, userId, eventName) {
  expect(actualEvent.correlationId).toEqual(correlationId);
  expect(actualEvent.name).toEqual(eventName);
  expect(actualEvent.roomId).toEqual(roomId);
  expect(actualEvent.userId).toEqual(userId);
  expect(actualEvent.payload).toBeDefined();
  expect(typeof actualEvent.payload).toEqual('object');
}

/**
 * our mock roomsStore contains only one room.
 * commandProcessor will load this room (if set), and store back manipulated room.
 *
 * room object can be manually manipulated to prepare for different scenarios.
 *
 * @param {Immutable.Map | object} [initialRoom] If not set, room will not exists in store.
 */
function newMockRoomsStore(initialRoom) {
  let room = initialRoom
    ? initialRoom.toJS
      ? initialRoom
      : Immutable.fromJS(initialRoom)
    : undefined;

  return {
    getRoomById: (id) => {
      if (!room || room.get('id') !== id) {
        return Promise.resolve(undefined);
      }
      return Promise.resolve(room);
    },
    getRoomByAlias: (alias) => {
      if (!room || room.get('alias') !== alias) {
        return Promise.resolve(undefined);
      }
      return Promise.resolve(room);
    },
    saveRoom: (rm) => {
      room = rm;
      return Promise.resolve();
    },
    manipulate: (fn) => (room = fn(room))
  };
}
