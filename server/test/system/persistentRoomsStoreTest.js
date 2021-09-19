import {v4 as uuid} from 'uuid';

import persistentRoomsStore from '../../src/store/persistentRoomsStore';

const LOCAL_MONGODB_CONNECTION_URI = 'mongodb://localhost:27017';
const LOCAL_MONGODB_TEST_DB_NAME = 'poinz_integration_test';

describe('initialization', () => {
  test('should connect to running mongoDB instance', async () => {
    await persistentRoomsStore.init(
      LOCAL_MONGODB_CONNECTION_URI + '/' + LOCAL_MONGODB_TEST_DB_NAME
    );

    await persistentRoomsStore.close();
  });

  test('should reject with connectionURI that points to a nonexisting mongoDB instance', async () => {
    return expect(
      persistentRoomsStore.init('mongodb://localhost:62222/' + LOCAL_MONGODB_TEST_DB_NAME)
    ).rejects.toThrow(
      /Could not connect to persistent Storage mongodb:\/\/localhost:62222\/poinz_integration_test/
    );
  }, 10000);

  test('should reject with missing connectionURI in config', async () => {
    return expect(persistentRoomsStore.init('')).rejects.toThrow(/Please provide "connectionURI"/);
  });
});

describe('save, update and fetch', () => {
  beforeAll(async () => {
    await persistentRoomsStore.init(
      LOCAL_MONGODB_CONNECTION_URI + '/' + LOCAL_MONGODB_TEST_DB_NAME
    );
  });

  afterAll(async () => {
    await persistentRoomsStore.close();
  });

  test('should save and get room back', async () => {
    const roomObject = {
      id: uuid(),
      users: {},
      other: 'data'
    };
    await persistentRoomsStore.saveRoom(roomObject);

    const retrievedRoom = await persistentRoomsStore.getRoomById(roomObject.id);

    expect(retrievedRoom).toBeDefined();
    expect(retrievedRoom.id).toBe(roomObject.id);
    expect(Object.prototype.hasOwnProperty.call(retrievedRoom, '_id')).toBe(false);
  });

  test('should resolve to undefined if room with given id does not exist', async () => {
    const retrievedRoom = await persistentRoomsStore.getRoomById('no-room-has-this-id');

    expect(retrievedRoom).toBeUndefined();
  });

  test('should save twice (update) and get room back', async () => {
    const roomObject = {
      id: uuid(),
      users: {},
      other: 'data'
    };
    await persistentRoomsStore.saveRoom(roomObject);

    // now call saveRoom() again with a new object that has the same "id"
    const roomObjectModified = {
      ...roomObject,
      additional: '....data...'
    };
    await persistentRoomsStore.saveRoom(roomObjectModified);

    const retrievedRoom = await persistentRoomsStore.getRoomById(roomObject.id);

    expect(retrievedRoom).toBeDefined();
    expect(retrievedRoom.id).toBe(roomObject.id);
    expect(retrievedRoom.other).toBe('data');
    expect(retrievedRoom.additional).toBe('....data...');
  });

  test('should return all Rooms', async () => {
    const roomObject = {
      id: uuid(),
      users: {},
      other: 'data'
    };
    await persistentRoomsStore.saveRoom(roomObject);

    const allRooms = await persistentRoomsStore.getAllRooms();

    expect(allRooms).toBeDefined();
    expect(Object.values(allRooms).length).toBeGreaterThan(0);

    const matchingRoomFromMap = allRooms[roomObject.id];
    expect(matchingRoomFromMap).toBeDefined();
    expect(matchingRoomFromMap.id).toBe(roomObject.id);
  });
});

describe('housekeeping', () => {
  beforeAll(async () => {
    await persistentRoomsStore.init(
      LOCAL_MONGODB_CONNECTION_URI + '/' + LOCAL_MONGODB_TEST_DB_NAME
    );
  });

  afterAll(async () => {
    await persistentRoomsStore.close();
  });

  test('should mark for deletion and then delete rooms that have not been used for a long time', async () => {
    const oldRoomObject = {
      id: uuid(),
      users: {},
      description: 'test room old created and last activity timestamps',
      created: 0,
      lastActivity: 0
    };
    const newerRoomObject = {
      id: uuid(),
      users: {},
      description: 'test room  new',
      created: Date.now(),
      lastActivity: Date.now()
    };
    await persistentRoomsStore.saveRoom(oldRoomObject);
    await persistentRoomsStore.saveRoom(newerRoomObject);

    let houseKeepingReport = await persistentRoomsStore.housekeeping();
    expect(houseKeepingReport.markedForDeletion.length).toBe(1);
    expect(houseKeepingReport.markedForDeletion[0]).toEqual(oldRoomObject.id);
    expect(houseKeepingReport.deleted.length).toBe(0);

    // we can still fetch it, is marked for deletion
    let retrievedRoom = await persistentRoomsStore.getRoomById(oldRoomObject.id);
    expect(retrievedRoom).toBeDefined();
    expect(retrievedRoom.markedForDeletion).toBe(true);

    // --  call housekeeping a second time
    houseKeepingReport = await persistentRoomsStore.housekeeping();
    expect(houseKeepingReport.markedForDeletion.length).toBe(0);
    expect(houseKeepingReport.deleted.length).toBe(1);
    expect(houseKeepingReport.deleted[0]).toEqual(oldRoomObject.id);

    // now it no longer exists
    retrievedRoom = await persistentRoomsStore.getRoomById(oldRoomObject.id);
    expect(retrievedRoom).toBeUndefined();

    // just make sure to remove the other room as well to clean up after ourselves.
    newerRoomObject.markedForDeletion = true;
    await persistentRoomsStore.saveRoom(newerRoomObject);
    await persistentRoomsStore.housekeeping();

    retrievedRoom = await persistentRoomsStore.getRoomById(newerRoomObject.id);
    expect(retrievedRoom).toBeUndefined();
  });

  test('should keep old rooms with recent activity', async () => {
    const oldRoomObject = {
      id: uuid(),
      users: {},
      description: 'test room old created but recent activity',
      created: 0,
      lastActivity: Date.now()
    };

    await persistentRoomsStore.saveRoom(oldRoomObject);

    // call housekeeping twice
    await persistentRoomsStore.housekeeping();
    const houseKeepingReport = await persistentRoomsStore.housekeeping();
    expect(houseKeepingReport.markedForDeletion.length).toBe(0);
    expect(houseKeepingReport.deleted.length).toBe(0);

    let retrievedRoom = await persistentRoomsStore.getRoomById(oldRoomObject.id);
    expect(retrievedRoom).toBeDefined();
    expect(retrievedRoom.markedForDeletion).toBeUndefined(); // flag never set

    // just make sure to remove the added room to clean up after ourselves.
    oldRoomObject.markedForDeletion = true;
    await persistentRoomsStore.saveRoom(oldRoomObject);
    await persistentRoomsStore.housekeeping();

    retrievedRoom = await persistentRoomsStore.getRoomById(oldRoomObject.id);
    expect(retrievedRoom).toBeUndefined();
  });
});

test('has getStoreType() function', async () => {
  const storeTypeString = persistentRoomsStore.getStoreType();
  expect(storeTypeString).toBe('PersistentRoomsStore on mongodb');
});
