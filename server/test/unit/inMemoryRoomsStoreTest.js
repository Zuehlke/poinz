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
