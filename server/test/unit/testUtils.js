import Promise from 'bluebird';
import util from 'util';
import assert from 'assert';

export default {
  assertValidEvent,
  assertPromiseRejects,
  newMockRoomsStore
};

function assertValidEvent(actualEvent, correlationId, roomId, userId, eventName) {
  assert.equal(actualEvent.correlationId, correlationId);
  assert.equal(actualEvent.name, eventName);
  assert.equal(actualEvent.roomId, roomId);
  assert.equal(actualEvent.userId, userId);
  assert(actualEvent.payload);
  assert(typeof actualEvent.payload === 'object');
}

/**
 * Asserts that the given promise rejects and that the error contains the expected message.
 *
 * @param {Promise.<T>} promise
 * @param {String} expectedErrorMessage
 * @returns {Promise.<T>} a new Promise that will reject if the given promise resolves.
 */
function assertPromiseRejects(promise, expectedErrorMessage) {
  return promise
    .then((result) => {
      throw new Error('Given promise is expected to reject. but Resolved\n' + util.inspect(result));
    })
    .catch((err) => assertError(err, expectedErrorMessage));
}

function assertError(actualError, expectedMessage) {
  assert(actualError.message);
  assert(
    actualError.message.indexOf(expectedMessage) > -1,
    `Error is expected to contain "${expectedMessage}".\nWas "${actualError.message}"`
  );
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
  let room = initialRoom;
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
