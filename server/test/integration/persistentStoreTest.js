import {v4 as uuid} from 'uuid';

import persistentStore from '../../src/store/persistentStore';

const LOCAL_MONGODB_CONNECTION_URI = 'mongodb://localhost:27017';
const LOCAL_MONGODB_TEST_DB_NAME = 'poinz_integration_test';

describe('initialization', () => {
  test('should connect to running mongoDB instance', async () => {
    await persistentStore.init({
      connectionURI: LOCAL_MONGODB_CONNECTION_URI + '/' + LOCAL_MONGODB_TEST_DB_NAME
    });

    await persistentStore.close();
  });

  test('should reject with connectionURI that points to a nonexisting mongoDB instance', async () => {
    return expect(
      persistentStore.init({
        connectionURI: 'mongodb://localhost:62222/' + LOCAL_MONGODB_TEST_DB_NAME
      })
    ).rejects.toThrow(
      /Could not connect to persistent Storage mongodb:\/\/localhost:62222\/poinz_integration_test/
    );
  }, 10000);

  test('should reject with missing connectionURI in config', async () => {
    return expect(persistentStore.init({})).rejects.toThrow(/Please provide "connectionURI"/);
  });
});

describe('save, update and fetch rooms', () => {
  beforeAll(async () => {
    await persistentStore.init({
      connectionURI: LOCAL_MONGODB_CONNECTION_URI + '/' + LOCAL_MONGODB_TEST_DB_NAME
    });
  });

  afterAll(async () => {
    await persistentStore.close();
  });

  test('should save and get room back', async () => {
    const roomObject = {
      id: uuid(),
      users: {},
      other: 'data'
    };
    await persistentStore.saveRoom(roomObject);

    const retrievedRoom = await persistentStore.getRoomById(roomObject.id);

    expect(retrievedRoom).toBeDefined();
    expect(retrievedRoom.id).toBe(roomObject.id);
    expect(Object.prototype.hasOwnProperty.call(retrievedRoom, '_id')).toBe(false);
  });

  test('should resolve to undefined if room with given id does not exist', async () => {
    const retrievedRoom = await persistentStore.getRoomById('no-room-has-this-id');

    expect(retrievedRoom).toBeUndefined();
  });

  test('should save twice (update) and get room back', async () => {
    const roomObject = {
      id: uuid(),
      users: {},
      other: 'data'
    };
    await persistentStore.saveRoom(roomObject);

    // now call saveRoom() again with a new object that has the same "id"
    const roomObjectModified = {
      ...roomObject,
      additional: '....data...'
    };
    await persistentStore.saveRoom(roomObjectModified);

    const retrievedRoom = await persistentStore.getRoomById(roomObject.id);

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
    await persistentStore.saveRoom(roomObject);

    const allRooms = await persistentStore.getAllRooms();

    expect(allRooms).toBeDefined();
    expect(Object.values(allRooms).length).toBeGreaterThan(0);

    const matchingRoomFromMap = allRooms[roomObject.id];
    expect(matchingRoomFromMap).toBeDefined();
    expect(matchingRoomFromMap.id).toBe(roomObject.id);
  });
});

describe('housekeeping', () => {
  beforeAll(async () => {
    await persistentStore.init({
      connectionURI: LOCAL_MONGODB_CONNECTION_URI + '/' + LOCAL_MONGODB_TEST_DB_NAME
    });
  });

  afterAll(async () => {
    await persistentStore.close();
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
    await persistentStore.saveRoom(oldRoomObject);
    await persistentStore.saveRoom(newerRoomObject);

    let houseKeepingReport = await persistentStore.housekeeping();
    expect(houseKeepingReport.markedForDeletion.length).toBe(1);
    expect(houseKeepingReport.markedForDeletion[0]).toEqual(oldRoomObject.id);
    expect(houseKeepingReport.deleted.length).toBe(0);

    // we can still fetch it, is marked for deletion
    let retrievedRoom = await persistentStore.getRoomById(oldRoomObject.id);
    expect(retrievedRoom).toBeDefined();
    expect(retrievedRoom.markedForDeletion).toBe(true);

    // --  call housekeeping a second time
    houseKeepingReport = await persistentStore.housekeeping();
    expect(houseKeepingReport.markedForDeletion.length).toBe(0);
    expect(houseKeepingReport.deleted.length).toBe(1);
    expect(houseKeepingReport.deleted[0]).toEqual(oldRoomObject.id);

    // now it no longer exists
    retrievedRoom = await persistentStore.getRoomById(oldRoomObject.id);
    expect(retrievedRoom).toBeUndefined();

    // just make sure to remove the other room as well to clean up after ourselves.
    newerRoomObject.markedForDeletion = true;
    await persistentStore.saveRoom(newerRoomObject);
    await persistentStore.housekeeping();

    retrievedRoom = await persistentStore.getRoomById(newerRoomObject.id);
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

    await persistentStore.saveRoom(oldRoomObject);

    // call housekeeping twice
    await persistentStore.housekeeping();
    const houseKeepingReport = await persistentStore.housekeeping();
    expect(houseKeepingReport.markedForDeletion.length).toBe(0);
    expect(houseKeepingReport.deleted.length).toBe(0);

    let retrievedRoom = await persistentStore.getRoomById(oldRoomObject.id);
    expect(retrievedRoom).toBeDefined();
    expect(retrievedRoom.markedForDeletion).toBeUndefined(); // flag never set

    // just make sure to remove the added room to clean up after ourselves.
    oldRoomObject.markedForDeletion = true;
    await persistentStore.saveRoom(oldRoomObject);
    await persistentStore.housekeeping();

    retrievedRoom = await persistentStore.getRoomById(oldRoomObject.id);
    expect(retrievedRoom).toBeUndefined();
  });
});

describe('get config values', () => {
  beforeAll(async () => {
    await persistentStore.init({
      connectionURI: LOCAL_MONGODB_CONNECTION_URI + '/' + LOCAL_MONGODB_TEST_DB_NAME
    });
  });

  afterAll(async () => {
    await persistentStore.close();
  });

  test('should get all config variables', async () => {
    const config = await persistentStore.getAppConfig();

    expect(config).toBeDefined();
    expect(config.githubAuthClientId).toBeDefined();
    expect(config.githubAuthSecret).toBeDefined();
    expect(config.jwtSecret).toBeDefined();
    expect(config.whitelistedUsers).toBeDefined();
    expect(config.whitelistedUsers.length).toBeDefined();
  });
});

test('has getStoreType() function', async () => {
  const storeTypeString = persistentStore.getStoreType();
  expect(storeTypeString).toBe('PersistentStore on mongodb');
});
