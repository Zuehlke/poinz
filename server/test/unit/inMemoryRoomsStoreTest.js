import uuid from '../../src/uuid';
import inMemoryRoomsStore from '../../src/store/inMemoryRoomsStore';

test('should save and retrieve a room', async () => {
  const roomId = uuid();
  await inMemoryRoomsStore.init();

  const roomObject = {
    id: roomId,
    arbitrary: 'data',
    nestedArray: [{a: 'some'}],
    nestedObject: {
      props: 1,
      properties: 'dklklö'
    }
  };

  await inMemoryRoomsStore.saveRoom(roomObject);
  const retr = await inMemoryRoomsStore.getRoomById(roomId);

  expect(retr).toEqual(roomObject);
});

test('should "detach" saved object', async () => {
  const roomId = uuid();
  await inMemoryRoomsStore.init();

  const roomObject = {
    id: roomId,
    arbitrary: 'data'
  };

  await inMemoryRoomsStore.saveRoom(roomObject);

  // manipulate stored room object "outside" the store
  roomObject.newAttribute = 'some value';
  const retr = await inMemoryRoomsStore.getRoomById(roomId);
  expect(retr !== roomObject);
  expect(Object.prototype.hasOwnProperty.call(retr, 'newAttribute')).toBe(false);

  // manipulate retrieved room object "outside" thestore
  retr.secondNewAttribtue = 'some nice value';
  const retr2 = await inMemoryRoomsStore.getRoomById(roomId);
  expect(retr2 !== retr);
  expect(Object.prototype.hasOwnProperty.call(retr2, 'secondNewAttribtue')).toBe(false);
});

test('should return undefined in unknown roomId', async () => {
  await inMemoryRoomsStore.init();
  return expect(inMemoryRoomsStore.getRoomById(uuid())).resolves.toBeUndefined();
});

test('has housekeeping() function', async () => {
  // just assert that roomsStore interface is complete. currently a no-op for inMemoryRoomsStore
  await inMemoryRoomsStore.init();
  const houseKeepingReport = await inMemoryRoomsStore.housekeeping();

  expect(houseKeepingReport.markedForDeletion.length).toBe(0);
  expect(houseKeepingReport.deleted.length).toBe(0);
});

test('has getStoreType() function', async () => {
  await inMemoryRoomsStore.init();
  const storeTypeString = inMemoryRoomsStore.getStoreType();
  expect(storeTypeString).toBe('InMemoryRoomsStore');
});
