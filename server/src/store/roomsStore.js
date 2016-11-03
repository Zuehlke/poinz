import redis from 'redis';
import Promise from 'bluebird';
import Immutable from 'immutable';

import settings from '../settings';
import logging from '../logging';

// "promisify" redis client with bluebird -> use client.getAsync / client.setAsync / etc.
Promise.promisifyAll(redis.RedisClient.prototype);

const LOGGER = logging.getLogger('roomsStore');

const POINZ_REDIS_KEY_PREFIX = 'poinz:';

var redisClient;

export default {
  init,
  getRoomById,
  saveRoom,
  getAllRooms
};

/**
 * do not connect to redis right away, let server invoke init
 * (since this roomsStore might be imported, but not actually used)
 */
function init() {
  redisClient = redis.createClient(settings.redis);
  redisClient.on('error', LOGGER.error);
  redisClient.select(0, (err, status) => LOGGER.info('select redis 0 ' + err + ' ' + status));
}

/**
 * returns the room with the given id or undefined if the store does not contain such a room.
 *
 * @param {string} roomId
 * @returns {Promise.<Immutable.Map>}
 */
function getRoomById(roomId) {
  return getRoomByIdIntern(POINZ_REDIS_KEY_PREFIX + roomId);
}

/**
 * pass in the already prependend ("poinz:") roomId
 */
function getRoomByIdIntern(roomIdPrepended) {
  return redisClient
    .getAsync(roomIdPrepended)
    .then(res => res ? redisValueToImmutableRoom(res) : undefined);
}

function redisValueToImmutableRoom(redisValue) {
  try {
    const parsedValue = JSON.parse(redisValue);
    return Immutable.fromJS(parsedValue);
  } catch (err) {
    throw new Error(`Invalid data in store ${redisValue }\n${err.message}`);
  }
}

/**
 * stores the given room object
 * @param {Immutable.Map} room
 * @returns {Promise<T>}
 */
function saveRoom(room) {
  return redisClient.setAsync(POINZ_REDIS_KEY_PREFIX + room.get('id'), JSON.stringify(room.toJS()));
}

/**
 * returns all rooms in the store.
 * (use with care!)
 *
 * @returns {Promise.<Immutable.List>}
 */
function getAllRooms() {
  return getAllKeysInCollection()
    .then(allKeys => Promise.all(allKeys.map(key => getRoomByIdIntern(key))))
    .then(allRooms => new Immutable.List(allRooms));
}

function getAllKeysInCollection() {

  let cursor = '0';
  let allKeys = [];

  return new Promise(doScan);


  function doScan(resolve, reject) {
    redisClient.scan(cursor, 'MATCH', POINZ_REDIS_KEY_PREFIX + '*', 'COUNT', '10', (err, res) => {
        if (err) {
          reject(err);
          return;
        }

        // Update the cursor position for the next scan
        cursor = res[0];
        // get the SCAN result for this iteration
        const keys = res[1];

        if (keys.length > 0) {
          allKeys = allKeys.concat(keys);
        }

        if (cursor === '0') {
          resolve(allKeys);
          return;
        }

        return doScan(resolve, reject);
      }
    );
  }
}

