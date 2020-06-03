import Immutable from 'immutable';
import {v4 as uuid} from 'uuid';
import roomStoreFactory from '../../src/store/roomStoreFactory';

test('should save and retrieve a room', () => {
  const roomId = uuid();
  const roomsStore = roomStoreFactory(false);

  const roomObject = Immutable.fromJS({
    id: roomId,
    arbitrary: 'data'
  });

  return expect(
    roomsStore.saveRoom(roomObject).then(() => roomsStore.getRoomById(roomId))
  ).resolves.toBeDefined();
});

test('should return undefined in unknown roomId', () => {
  const roomsStore = roomStoreFactory(false);
  return expect(roomsStore.getRoomById(uuid())).resolves.toBeUndefined();
});

test('should save and retrieve a room by alias', () => {
  const roomId = uuid();
  const roomsStore = roomStoreFactory(false);

  const roomObject = Immutable.fromJS({
    id: roomId,
    alias: 'some-custom-alias',
    arbitrary: 'data'
  });

  return expect(
    roomsStore.saveRoom(roomObject).then(() => roomsStore.getRoomByAlias('some-custom-alias'))
  ).resolves.toBeDefined();
});

test('should save multiple rooms with same alias', async () => {
  // with the "rooms alias" feature, there is one shortcoming:
  // if by accident two roms get created with the same alias (application does currently not prevent that)
  // when fetching by alias, the first matching room is returned...

  const roomsStore = roomStoreFactory(false);

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

  await roomsStore.saveRoom(roomObjectOne);
  await roomsStore.saveRoom(roomObjectTwo);

  const retrievedRoom = await roomsStore.getRoomByAlias('some-alias');

  expect([roomIdOne, roomIdTwo]).toContain(retrievedRoom.get('id')); // either roomOne or roomTwo is returned.
});
