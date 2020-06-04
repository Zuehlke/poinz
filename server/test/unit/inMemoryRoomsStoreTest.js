import Immutable from 'immutable';
import {v4 as uuid} from 'uuid';
import inMemoryRoomsStore from '../../src/store/inMemoryRoomsStore';

test('should save and retrieve a room', () => {
  const roomId = uuid();
  inMemoryRoomsStore.init();

  const roomObject = Immutable.fromJS({
    id: roomId,
    arbitrary: 'data'
  });

  return expect(
    inMemoryRoomsStore.saveRoom(roomObject).then(() => inMemoryRoomsStore.getRoomById(roomId))
  ).resolves.toBeDefined();
});

test('should return undefined in unknown roomId', () => {
  inMemoryRoomsStore.init();
  return expect(inMemoryRoomsStore.getRoomById(uuid())).resolves.toBeUndefined();
});

test('should save and retrieve a room by alias', () => {
  const roomId = uuid();
  inMemoryRoomsStore.init();

  const roomObject = Immutable.fromJS({
    id: roomId,
    alias: 'some-custom-alias',
    arbitrary: 'data'
  });

  return expect(
    inMemoryRoomsStore
      .saveRoom(roomObject)
      .then(() => inMemoryRoomsStore.getRoomByAlias('some-custom-alias'))
  ).resolves.toBeDefined();
});

test('should save multiple rooms with same alias', async () => {
  // with the "rooms alias" feature, there is one shortcoming:
  // if by accident two roms get created with the same alias (application does currently not prevent that)
  // when fetching by alias, the first matching room is returned...

  inMemoryRoomsStore.init();

  const roomIdOne = uuid();
  const roomIdTwo = uuid();

  const roomObjectOne = Immutable.fromJS({
    id: roomIdOne,
    alias: 'some-alias',
    arbitrary: 'data'
  });
  const roomObjectTwo = Immutable.fromJS({
    id: roomIdTwo,
    alias: 'some-alias',
    arbitrary: 'data two'
  });

  await inMemoryRoomsStore.saveRoom(roomObjectOne);
  await inMemoryRoomsStore.saveRoom(roomObjectTwo);

  const retrievedRoom = await inMemoryRoomsStore.getRoomByAlias('some-alias');

  expect([roomIdOne, roomIdTwo]).toContain(retrievedRoom.get('id')); // either roomOne or roomTwo is returned.
});

test('has housekeeping() function', async () => {
  // just assert that roomsStore interface is complete. currently a no-op for inMemoryRoomsStore
  await inMemoryRoomsStore.init();
  const houseKeepingReport = await inMemoryRoomsStore.housekeeping();

  expect(houseKeepingReport.markedForDeletion.length).toBe(0);
  expect(houseKeepingReport.deleted.length).toBe(0);
});
