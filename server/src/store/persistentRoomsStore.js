import {MongoClient} from 'mongodb';

import getLogger from '../getLogger';

const COLLECTION_NAME = 'rooms';

// on every server start, we run DB "Housekeeping".
// if a room has a "lastActivity" timestamp that is older than X days, it is marked for deletion.
// in the next subsequent housekeeping run, these rooms are deleted!
// in January 22 we raised it from 31 days (a month) to 61 days (two months)
const AUTOMATIC_ROOM_DELETION_THRESHOLD_DAYS = 61;

const LOGGER = getLogger('persistentRoomsStore');

let clientInstance;
let dbInstance;
let roomsCollection;

/**
 * implementation of a persistent room storage using mongoDB
 *
 *
 * see https://www.npmjs.com/package/mongodb
 *
 * v3.5  http://mongodb.github.io/node-mongodb-native/3.5/    and    http://mongodb.github.io/node-mongodb-native/3.5/api/
 *
 */
export default {
  init,
  close,
  saveRoom,
  getRoomById,
  getAllRooms,
  housekeeping,
  getStoreType
};

/**
 * initialize the persistent room storage
 * @param {string} connectionURI The db uri already contains username and password
 * @return {Promise<void>}
 */
async function init(connectionURI) {
  if (!connectionURI || typeof connectionURI !== 'string') {
    throw new Error('Please provide "connectionURI" as string');
  }

  LOGGER.info('Using persistent storage');

  clientInstance = new MongoClient(connectionURI, {
    serverSelectionTimeoutMS: 4000
  });

  try {
    clientInstance = await clientInstance.connect();
    dbInstance = clientInstance.db(); // connection string contains db name
    await dbInstance.command({ping: 1});

    logDbConnection(clientInstance);

    roomsCollection = dbInstance.collection(COLLECTION_NAME);

    await roomsCollection.createIndex('id', {unique: true, name: 'id_roomId'});
  } catch (error) {
    throw new Error('Could not connect to persistent Storage ' + connectionURI);
  }
}

async function close() {
  if (clientInstance) {
    await clientInstance.close();
  }
}

/**
 * Safely extract information about connection, do not log "url" (connectionURI), it might contain auth info.
 *
 * @param clInstance
 */
function logDbConnection(clInstance) {
  if (!clInstance || !clInstance.s) {
    LOGGER.info('connected to mongodb on  ?');
  }
  const {s} = clInstance;

  const server =
    s.options && s.options.servers && s.options.servers.length
      ? `${s.options.servers[0].host}:${s.options.servers[0].port}`
      : '?';
  const dbName = s.options ? s.options.dbName : '?';

  LOGGER.info(`connected to mongodb on "${server}", dbName "${dbName}"`);
}

/**
 * remove old/unused rooms
 * remove rooms that are marked for deletion.
 * mark rooms for deletion that have a "lastActivity" timestamp below threshold
 *
 * @return {Promise<{deleted: *[], markedForDeletion: *[]}>}
 */
async function housekeeping() {
  const deletedIds = await houskeepingDeleteMarked();

  const markedIds = await housekeepingMarkForDeletion();

  return {
    markedForDeletion: markedIds,
    deleted: deletedIds
  };
}

async function houskeepingDeleteMarked() {
  const rooms = await roomsCollection
    .find({markedForDeletion: true})
    .project({_id: 1, id: 1})
    .toArray();
  const roomIds = rooms.map((r) => r.id);
  const roomInternalIds = rooms.map((r) => r._id);

  const deleteResult = await roomsCollection.deleteMany({_id: {$in: roomInternalIds}});

  if (rooms.length !== deleteResult.deletedCount) {
    LOGGER.warn('inconsistency during houskeepingDeleteMarked', rooms, deleteResult.deletedCount);
  }

  return roomIds;
}

async function housekeepingMarkForDeletion() {
  const moreThanXDaysInMS = 1000 * 60 * 60 * 24 * AUTOMATIC_ROOM_DELETION_THRESHOLD_DAYS; // 1000 ms * 60 seconds * 60 minutes * 24 h * DAYS
  const thresholdTimeStamp = Date.now() - moreThanXDaysInMS;

  const rooms = await roomsCollection
    .find({lastActivity: {$lt: thresholdTimeStamp}})
    .project({_id: 1, id: 1})
    .toArray();
  const roomIds = rooms.map((r) => r.id);
  const roomInternalIds = rooms.map((r) => r._id);

  const updateResult = await roomsCollection.updateMany(
    {
      _id: {$in: roomInternalIds}, // where _id is within list of found rooms
      markedForDeletion: {$ne: true} // AND not marked (flag not present or set to falsy value)
    },
    {$set: {markedForDeletion: true}}
  );

  if (roomIds.length !== updateResult.matchedCount) {
    LOGGER.error(
      'inconsistency during housekeepingMarkForDeletion',
      roomIds,
      updateResult.matchedCount
    );
  }

  return roomIds;
}

/**
 * saves the given room object (replaces an already existing room with the same unique "id")
 *
 * @param {object} room
 * @return {Promise<void>}
 */
async function saveRoom(room) {
  await roomsCollection.replaceOne({id: room.id}, room, {upsert: true});
}

/**
 * returns a room by its unique id (the roomId, not the mongodb internal _id)
 * @param {string} roomId
 * @return {Promise<object | undefined>}
 */
async function getRoomById(roomId) {
  const room = await roomsCollection.findOne({id: roomId});

  if (room) {
    delete room._id; // we don't want to return the room with the mongodb internal id
    return room;
  } else {
    return undefined;
  }
}

/**
 *
 * @return {Promise<void>}
 */
async function getAllRooms() {
  const rooms = await roomsCollection.find().toArray();

  return rooms.reduce((roomsMap, currentRoom) => {
    delete currentRoom._id;
    roomsMap[currentRoom.id] = currentRoom;
    return roomsMap;
  }, {});
}

function getStoreType() {
  return 'PersistentRoomsStore on mongodb';
}
