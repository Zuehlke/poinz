import {v4 as uuid} from 'uuid';

import inMemoryStore from '../../src/store/inMemoryStore';

test('should save and retrieve a room', async () => {
  const roomId = uuid();
  await inMemoryStore.init();

  const roomObject = {
    id: roomId,
    arbitrary: 'data',
    nestedArray: [{a: 'some'}],
    nestedObject: {
      props: 1,
      properties: 'dklklö'
    }
  };

  await inMemoryStore.saveRoom(roomObject);
  const retr = await inMemoryStore.getRoomById(roomId);

  expect(retr).toEqual(roomObject);
});

test('should "detach" saved object', async () => {
  const roomId = uuid();
  await inMemoryStore.init();

  const roomObject = {
    id: roomId,
    arbitrary: 'data'
  };

  await inMemoryStore.saveRoom(roomObject);

  // manipulate stored room object "outside" the store
  roomObject.newAttribute = 'some value';
  const retr = await inMemoryStore.getRoomById(roomId);
  expect(retr !== roomObject);
  expect(Object.prototype.hasOwnProperty.call(retr, 'newAttribute')).toBe(false);

  // manipulate retrieved room object "outside" thestore
  retr.secondNewAttribtue = 'some nice value';
  const retr2 = await inMemoryStore.getRoomById(roomId);
  expect(retr2 !== retr);
  expect(Object.prototype.hasOwnProperty.call(retr2, 'secondNewAttribtue')).toBe(false);
});

test('should return undefined in unknown roomId', async () => {
  await inMemoryStore.init();
  return expect(inMemoryStore.getRoomById(uuid())).resolves.toBeUndefined();
});

describe('get config values', () => {
  test('should get all config variables', async () => {
    await inMemoryStore.init();
    const config = await inMemoryStore.getAppConfig();

    expect(config).toBeDefined();
    expect(config.githubAuthClientId).toBeDefined();
    expect(config.githubAuthSecret).toBeDefined();
    expect(config.jwtSecret).toBeDefined();
  });
});

test('has housekeeping() function', async () => {
  // just assert that roomsStore interface is complete. currently a no-op for inMemoryStore
  await inMemoryStore.init();
  const houseKeepingReport = await inMemoryStore.housekeeping();

  expect(houseKeepingReport.markedForDeletion.length).toBe(0);
  expect(houseKeepingReport.deleted.length).toBe(0);
});

test('has getStoreType() function', async () => {
  await inMemoryStore.init();
  const storeTypeString = inMemoryStore.getStoreType();
  expect(storeTypeString).toBe('InMemoryStore');
});
