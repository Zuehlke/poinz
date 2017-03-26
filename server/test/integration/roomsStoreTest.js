import assert from 'assert';
import Immutable from 'immutable';
import {v4 as uuid} from 'uuid';
import roomStoreFactory from '../../src/store/roomStoreFactory';

/**
 * NOTE: for this test, the redis db must be running
 */
describe('roomsStore', () => {


  it('should save and retrieve a room', () => {
    const roomsStore = roomStoreFactory(true);
    const roomId = uuid();

    return roomsStore
      .saveRoom(Immutable.fromJS({
        id: roomId,
        arbitrary: 'data'
      }))
      .then(() => {
        return roomsStore.getRoomById(roomId);
      })
      .then(retrievedRoom => {
        assert(retrievedRoom);
      });

  });

  it('should return undefined in unknown roomId', () => {
    const roomsStore = roomStoreFactory(true);
    return roomsStore
      .getRoomById(uuid())
      .then(retrievedRoom => assert(!retrievedRoom));
  });

});
