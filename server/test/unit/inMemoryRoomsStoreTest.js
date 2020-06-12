import Immutable from 'immutable';
import {v4 as uuid} from 'uuid';
import inMemoryRoomsStore from '../../src/store/inMemoryRoomsStore';

test('should save and retrieve a room', async () => {
  const roomId = uuid();
  await inMemoryRoomsStore.init();

  const roomObject = Immutable.fromJS({
    id: roomId,
    arbitrary: 'data'
  });

  return expect(
    inMemoryRoomsStore.saveRoom(roomObject).then(() => inMemoryRoomsStore.getRoomById(roomId))
  ).resolves.toBeDefined();
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
