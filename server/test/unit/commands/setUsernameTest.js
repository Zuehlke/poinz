import {v4 as uuid} from 'uuid';
import testUtils from '../testUtils';
import processorFactory from '../../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers from '../../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../../src/eventHandlers/eventHandlers';

test('Should produce usernameSet event', async () => {
  const {processor, roomId, userId} = await prep();
  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'setUsername',
      payload: {
        userId: userId,
        username: 'John Doe'
      }
    },
    userId
  ).then((producedEvents) => {
    expect(producedEvents).toBeDefined();
    expect(producedEvents.length).toBe(1);

    const usernameSetEvent = producedEvents[0];
    testUtils.assertValidEvent(usernameSetEvent, commandId, roomId, userId, 'usernameSet');
    expect(usernameSetEvent.payload.username).toEqual('John Doe');
    expect(usernameSetEvent.payload.userId).toEqual(userId);
  });
});

test('Should store username', async () => {
  const {processor, roomId, userId, mockRoomsStore} = await prep();
  const commandId = uuid();

  return processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'setUsername',
      payload: {
        userId: userId,
        username: 'Mikey'
      }
    },
    userId
  )
    .then(() => mockRoomsStore.getRoomById(roomId))
    .then((room) => expect(room.getIn(['users', userId, 'username'])).toEqual('Mikey'));
});

describe('preconditions', () => {
  test('Should throw if userId does not match', async () => {
    const {processor, roomId, userId} = await prep();
    const commandId = uuid();
    return expect(
      processor(
        {
          id: commandId,
          roomId: roomId,
          name: 'setUsername',
          payload: {
            userId: 'unknown',
            username: 'Mikey'
          }
        },
        userId
      )
    ).rejects.toThrow('Can only set username for own user!');
  });
});

/**
 * prepares mock rooms store  with one user
 */
async function prep() {
  const userId = uuid();
  const roomId = 'rm_' + uuid();

  const mockRoomsStore = testUtils.newMockRoomsStore({
    id: roomId,
    users: {
      [userId]: {
        id: userId
      }
    }
  });
  const processor = processorFactory(commandHandlers, eventHandlers, mockRoomsStore);

  return {userId, roomId, processor, mockRoomsStore};
}
