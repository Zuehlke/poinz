import {v4 as uuid} from 'uuid';
import testUtils from '../testUtils';
import processorFactory from '../../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers from '../../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../../src/eventHandlers/eventHandlers';

test('Should produce kicked event (userOne kicks disconnected userTwo)', async () => {
  const {roomId, userOneId, userTwoId, processor} = await prep();
  const commandId = uuid();

  return processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'kick',
      payload: {
        userId: userTwoId
      }
    },
    userOneId
  ).then((producedEvents) => {
    expect(producedEvents).toBeDefined();
    expect(producedEvents.length).toBe(1);

    const kickedEvent = producedEvents[0];
    testUtils.assertValidEvent(kickedEvent, commandId, roomId, userOneId, 'kicked');
    expect(kickedEvent.payload.userId).toEqual(userTwoId);
  });
});

test('Should remove user from room', async () => {
  const {roomId, userOneId, userTwoId, processor, mockRoomsStore} = await prep();
  return processor(
    {
      id: uuid(),
      roomId,
      name: 'kick',
      payload: {
        userId: userTwoId
      }
    },
    userOneId
  )
    .then(() => mockRoomsStore.getRoomById(roomId))
    .then((room) => expect(room.getIn(['users', userTwoId])).toBeUndefined());
});

describe('preconditions', () => {
  test('Should throw if userId does not match any user from the room', async () => {
    const {roomId, userIdOne, processor} = await prep();
    return expect(
      processor(
        {
          id: uuid(),
          roomId,
          name: 'kick',
          payload: {
            userId: 'unknown'
          }
        },
        userIdOne
      )
    ).rejects.toThrow('Can only kick user that belongs to the same room!');
  });

  test('Should throw if tries to kick himself', async () => {
    const {roomId, userOneId, processor} = await prep();
    return expect(
      processor(
        {
          id: uuid(),
          roomId,
          name: 'kick',
          payload: {
            userId: userOneId
          }
        },
        userOneId
      )
    ).rejects.toThrow('User cannot kick himself!');
  });

  test('Should throw if visitor tries to kick', async () => {
    const {roomId, userOneId, userTwoId, processor, mockRoomsStore} = await prep();

    mockRoomsStore.manipulate((room) => room.setIn(['users', userOneId, 'visitor'], true));

    return expect(
      processor(
        {
          id: uuid(),
          roomId,
          name: 'kick',
          payload: {
            userId: userTwoId
          }
        },
        userOneId
      )
    ).rejects.toThrow('Visitors cannot kick other users!');
  });
});

/**
 * create mock room store with two users. userTwo is marked as disconnected
 */
function prep() {
  const userOneId = uuid();
  const userTwoId = uuid();
  const roomId = 'rm_' + uuid();

  const mockRoomsStore = testUtils.newMockRoomsStore({
    id: roomId,
    stories: [],
    users: {
      [userOneId]: {
        id: userOneId
      },
      [userTwoId]: {
        id: userOneId,
        disconnected: true
      }
    }
  });

  const processor = processorFactory(commandHandlers, eventHandlers, mockRoomsStore);

  return {userOneId, userTwoId, roomId, mockRoomsStore, processor};
}
