import {v4 as uuid} from 'uuid';
import Immutable from 'immutable';

import persistentRoomsStore from '../../src/store/persistentRoomsStore';

const LOCAL_MONGODB_CONNECTION_URI = 'mongodb://localhost:27017';
const LOCAL_MONGODB_TEST_DB_NAME = 'poinz_integration_test';

describe('initialization', () => {
  test('should connect to running mongoDB instance', async () => {
    await persistentRoomsStore.init({
      connectionURI: LOCAL_MONGODB_CONNECTION_URI,
      dbName: LOCAL_MONGODB_TEST_DB_NAME
    });

    await persistentRoomsStore.close();
  });

  test('should reject with connectionURI that points to a nonexisting mongoDB instance', async () => {
    return expect(
      persistentRoomsStore.init({
        connectionURI: 'mongodb://localhost:62222',
        dbName: 'someName'
      })
    ).rejects.toThrow(/Could not connect to persistent Storage mongodb:\/\/localhost:62222/);
  }, 10000);

  test('should reject with missing connectionURI in config', async () => {
    return expect(persistentRoomsStore.init({})).rejects.toThrow(/Please provide "connectionURI"/);
  });

  test('should reject with missing dbName in config', async () => {
    return expect(
      persistentRoomsStore.init({
        connectionURI: 'someURI'
      })
    ).rejects.toThrow(/Please provide "dbName"/);
  });
});

describe('save, update and fetch', () => {
  beforeAll(async () => {
    await persistentRoomsStore.init({
      connectionURI: LOCAL_MONGODB_CONNECTION_URI,
      dbName: LOCAL_MONGODB_TEST_DB_NAME
    });
  });

  afterAll(async () => {
    await persistentRoomsStore.close();
  });

  test('should save and get room back', async () => {
    const roomObject = new Immutable.Map({
      id: uuid(),
      users: {},
      other: 'data'
    });
    await persistentRoomsStore.saveRoom(roomObject);

    const retrievedRoom = await persistentRoomsStore.getRoomById(roomObject.get('id'));

    expect(retrievedRoom).toBeDefined();
    expect(retrievedRoom.get('id')).toBe(roomObject.get('id'));
    expect(retrievedRoom.has('_id')).toBe(false);
  });

  test('should resolve to undefined if room with given id does not exist', async () => {
    const retrievedRoom = await persistentRoomsStore.getRoomById('no-room-has-this-id');

    expect(retrievedRoom).toBeUndefined();
  });

  test('should save twice (update) and get room back', async () => {
    const roomObject = new Immutable.Map({
      id: uuid(),
      users: {},
      other: 'data'
    });
    await persistentRoomsStore.saveRoom(roomObject);

    // now call saveRoom() again with a new object that has the same "id"
    const roomObjectModified = roomObject.set('additional', '....data...');
    await persistentRoomsStore.saveRoom(roomObjectModified);

    const retrievedRoom = await persistentRoomsStore.getRoomById(roomObject.get('id'));

    expect(retrievedRoom).toBeDefined();
    expect(retrievedRoom.get('id')).toBe(roomObject.get('id'));
    expect(retrievedRoom.get('other')).toBe('data');
    expect(retrievedRoom.get('additional')).toBe('....data...');
  });

  test('should save and get room by alias', async () => {
    const roomObject = new Immutable.Map({
      id: uuid(),
      users: {},
      alias: 'some-custom-alias',
      other: 'data'
    });
    await persistentRoomsStore.saveRoom(roomObject);

    const retrievedRoom = await persistentRoomsStore.getRoomByAlias(roomObject.get('alias'));

    expect(retrievedRoom).toBeDefined(); // currently it is not guaranteed, that we get our room object back. could be another one with the same alias. alias uniqueness is not enforced
    expect(retrievedRoom.has('_id')).toBe(false);
  });

  test('should resolve to undefined if no room with alias exists', async () => {
    const retrievedRoom = await persistentRoomsStore.getRoomByAlias('no-room-has-this-alias');

    expect(retrievedRoom).toBeUndefined();
  });

  test('should return all Rooms', async () => {
    const roomObject = new Immutable.Map({
      id: uuid(),
      users: {},
      other: 'data'
    });
    await persistentRoomsStore.saveRoom(roomObject);

    const allRooms = await persistentRoomsStore.getAllRooms();

    expect(allRooms).toBeDefined();
    expect(allRooms.size).toBeGreaterThan(0);

    const matchingRoomFromMap = allRooms.get(roomObject.get('id'));
    expect(matchingRoomFromMap).toBeDefined();
    expect(matchingRoomFromMap.get('id')).toBe(roomObject.get('id'));
  });
});
