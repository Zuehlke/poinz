import {MongoClient} from 'mongodb';
import Immutable from 'immutable';

const COLLECTION_NAME = 'rooms';

let clientInstance;
let dbInstance;
let roomsCollection;

/**
 * implementation of a persistent room storage using mongoDB
 */
export default {
  init,
  close,
  saveRoom,
  getRoomById,
  getRoomByAlias,
  getAllRooms
};

async function init(config) {
  if (!config.connectionURI) {
    throw new Error('Please provide "connectionURI"');
  }
  if (!config.dbName) {
    throw new Error('Please provide "dbName"');
  }

  clientInstance = new MongoClient(config.connectionURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 4000
  });

  try {
    await clientInstance.connect();
    dbInstance = clientInstance.db(config.dbName);

    roomsCollection = dbInstance.collection(COLLECTION_NAME);

    await roomsCollection.createIndex('id', {unique: true, name: 'id_roomId'});
  } catch (error) {
    throw new Error('Could not connect to persistent Storage ' + config.connectionURI);
  }
}

async function close() {
  if (clientInstance) {
    await clientInstance.close();
  }
}

/**
 * saves the given room object (replaces an already existing room with the same unique "id")
 *
 * @param {Immutable.Map} room
 * @return {Promise<void>}
 */
async function saveRoom(room) {
  const roomPlain = room.toJS();
  await roomsCollection.replaceOne({id: roomPlain.id}, roomPlain, {upsert: true});
}

/**
 * returns a room by its unique id (the roomId, not the mongodb internal _id)
 * @param {string} roomId
 * @return {Promise<Immutable.Map | undefined>}
 */
async function getRoomById(roomId) {
  const room = await roomsCollection.findOne({id: roomId});

  if (room) {
    delete room._id; // we don't want to return the room with the mongodb internal id
    return Immutable.fromJS(room);
  } else {
    return undefined;
  }
}

async function getRoomByAlias(roomAlias) {
  const rooms = await roomsCollection.find({alias: roomAlias}).toArray();

  if (rooms.length > 0) {
    delete rooms[0]._id; // we don't want to return the room with the mongodb internal id
    return Immutable.fromJS(rooms[0]);
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

  const roomsMap = rooms.reduce((roomsMap, currentRoom) => {
    delete currentRoom._id;
    roomsMap[currentRoom.id] = currentRoom;
    return roomsMap;
  }, {});

  return Immutable.fromJS(roomsMap);
}
