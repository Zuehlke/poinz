const
  assert = require('assert'),
  _ = require('lodash');

module.exports = {
  assertValidEvent,
  newMockRoomsStore
};


function assertValidEvent(actualEvent, correlationId, roomId, userId, eventName) {
  assert.equal(actualEvent.correlationId, correlationId);
  assert.equal(actualEvent.name, eventName);
  assert.equal(actualEvent.roomId, roomId);
  assert.equal(actualEvent.userId, userId);
  assert(actualEvent.payload);
  assert(_.isPlainObject(actualEvent.payload));
}

/**
 * our mock roomsStore contains only one room.
 * commandProcessor will load this room (if set), and store back manipulated room.
 *
 * room object can be manually manipulated to prepare for different scenarios.
 *
 * @param {Immutable.Map} [initialRoom] If not set, room will not exists in store.
 */
function newMockRoomsStore(initialRoom) {
  var room = initialRoom;
  return {
    getRoomById: () => room,
    saveRoom: rm => room = rm,
    manipulate: fn => room = fn(room)
  };
}
