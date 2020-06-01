import {v4 as uuid} from 'uuid';
import {prepOneUserInOneRoom} from '../testUtils';

describe('visitorSet', () => {
  test('Should produce visitorSet event', async () => {
    const {userId, processor, roomId, mockRoomsStore} = await prepOneUserInOneRoom();
    mockRoomsStore.manipulate((room) => room.setIn(['users', userId, 'visitor'], false));
    return handleCommandAndAssert(processor, roomId, userId);
  });

  test('Should also produce event if already set (event is idempotent)', async () => {
    const {userId, processor, roomId, mockRoomsStore} = await prepOneUserInOneRoom();
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
    ).then(({producedEvents, room}) => {
      expect(producedEvents).toMatchEvents(commandId, roomId, 'visitorSet');

      const [visitorSetEvent] = producedEvents;

      expect(visitorSetEvent.payload.userId).toEqual(userId);

      // flag is set on user in room
      expect(room.users[userId].visitor).toBe(true);
    });
  }
});

describe('visitorUnset', () => {
  test('Should produce visitorUnset event', async () => {
    const {userId, processor, roomId, mockRoomsStore} = await prepOneUserInOneRoom();
    mockRoomsStore.manipulate((room) => room.setIn(['users', userId, 'visitor'], true));
    return handleCommandAndAssert(processor, roomId, userId);
  });

  test('Should also produce event if already unset (event is idempotent)', async () => {
    const {userId, processor, roomId, mockRoomsStore} = await prepOneUserInOneRoom();
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
    ).then(({producedEvents, room}) => {
      expect(producedEvents).toMatchEvents(commandId, roomId, 'visitorUnset');

      const [visitorUnsetEvent] = producedEvents;

      expect(visitorUnsetEvent.payload.userId).toEqual(userId);

      // flag is no longer set on user in room
      expect(room.users[userId].visitor).toBe(false);
    });
  }
});

describe('preconditions', () => {
  test('Should throw if userId does not match', async () => {
    const {userId, processor, roomId} = await prepOneUserInOneRoom();
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
