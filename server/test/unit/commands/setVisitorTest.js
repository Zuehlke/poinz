import {v4 as uuid} from 'uuid';
import testUtils from '../testUtils';
import processorFactory from '../../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers from '../../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../../src/eventHandlers/eventHandlers';

describe('visitorSet', async () => {
  test('Should produce visitorSet event', async () => {
    const {userId, processor, roomId, mockRoomsStore} = await prep();
    mockRoomsStore.manipulate((room) => room.setIn(['users', userId, 'visitor'], false));
    return handleCommandAndAssert(processor, roomId, userId);
  });

  test('Should also produce event if already set (event is idempotent anyways)', async () => {
    const {userId, processor, roomId, mockRoomsStore} = await prep();
    mockRoomsStore.manipulate((room) => room.setIn(['users', userId, 'visitor'], true));
    return handleCommandAndAssert(processor, roomId, userId);
  });

  function handleCommandAndAssert(processor, roomId, userId) {
    const commandId = uuid();
    return processor(
      {
        id: commandId,
        roomId,
        name: 'setVisitor',
        payload: {
          userId,
          isVisitor: true
        }
      },
      userId
    ).then((producedEvents) => {
      expect(producedEvents).toBeDefined();
      expect(producedEvents.length).toBe(1);

      const visitorSetEvent = producedEvents[0];
      testUtils.assertValidEvent(visitorSetEvent, commandId, roomId, userId, 'visitorSet');
      expect(visitorSetEvent.payload.userId).toEqual(userId);
    });
  }
});

describe('visitorUnset', async () => {
  test('Should produce visitorUnset event', async () => {
    const {userId, processor, roomId, mockRoomsStore} = await prep();
    mockRoomsStore.manipulate((room) => room.setIn(['users', userId, 'visitor'], true));
    return handleCommandAndAssert(processor, roomId, userId);
  });

  test('Should also produce event if already unset (event is idempotent anyways)', async () => {
    const {userId, processor, roomId, mockRoomsStore} = await prep();
    mockRoomsStore.manipulate((room) => room.setIn(['users', userId, 'visitor'], false));
    return handleCommandAndAssert(processor, roomId, userId);
  });

  function handleCommandAndAssert(processor, roomId, userId) {
    const commandId = uuid();
    return processor(
      {
        id: commandId,
        roomId,
        name: 'setVisitor',
        payload: {
          userId,
          isVisitor: false
        }
      },
      userId
    ).then((producedEvents) => {
      expect(producedEvents).toBeDefined();
      expect(producedEvents.length).toBe(1);

      const visitorUnsetEvent = producedEvents[0];
      testUtils.assertValidEvent(visitorUnsetEvent, commandId, roomId, userId, 'visitorUnset');
      expect(visitorUnsetEvent.payload.userId).toEqual(userId);
    });
  }
});

test('Should store flag on set', async () => {
  const {userId, processor, roomId, mockRoomsStore} = await prep();
  const commandId = uuid();

  return processor(
    {
      id: commandId,
      roomId,
      name: 'setVisitor',
      payload: {
        userId,
        isVisitor: true
      }
    },
    userId
  )
    .then(() => mockRoomsStore.getRoomById(roomId))
    .then((room) => expect(room.getIn(['users', userId, 'visitor'])).toBe(true));
});

test('Should store flag on unset', async () => {
  const {userId, processor, roomId, mockRoomsStore} = await prep();
  mockRoomsStore.manipulate((room) => room.setIn(['users', userId, 'visitor'], true));
  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId,
      name: 'setVisitor',
      payload: {
        userId,
        isVisitor: false
      }
    },
    userId
  )
    .then(() => mockRoomsStore.getRoomById(roomId))
    .then((room) => expect(room.getIn(['users', userId, 'visitor'])).toBe(false));
});

describe('preconditions', () => {
  test('Should throw if userId does not match', async () => {
    const {userId, processor, roomId} = await prep();
    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'setVisitor',
          payload: {
            userId: 'unknown',
            isVisitor: true
          }
        },
        userId
      )
    ).rejects.toThrow('Can only set visitor flag for own user!');
  });
});

/**
 * prepares mock rooms store with one user
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
