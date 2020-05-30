import assert from 'assert';
import Immutable from 'immutable';
import {v4 as uuid} from 'uuid';
import roomStoreFactory from '../../src/store/roomStoreFactory';

describe('inMemoryRoomsStore', () => {
  it('should save and retrieve a room', () => {
    const roomId = uuid();
    const roomsStore = roomStoreFactory(false);

    return roomsStore
      .saveRoom(
        Immutable.fromJS({
          id: roomId,
          arbitrary: 'data'
        })
      )
      .then(() => {
        return roomsStore.getRoomById(roomId);
      })
      .then((retrievedRoom) => {
        assert(retrievedRoom);
      });
  });

  it('should return undefined in unknown roomId', () => {
    const roomsStore = roomStoreFactory(false);
    return roomsStore.getRoomById(uuid()).then((retrievedRoom) => assert(!retrievedRoom));
  });

  it('should save and retrieve a room by alias', () => {
    const roomId = uuid();
    const roomsStore = roomStoreFactory(false);

    return roomsStore
      .saveRoom(
        Immutable.fromJS({
          id: roomId,
          alias: 'some-custom-alias',
          arbitrary: 'data'
        })
      )
      .then(() => roomsStore.getRoomByAlias('some-custom-alias'))
      .then((retrievedRoom) => {
        assert(retrievedRoom);
      });
  });
});
