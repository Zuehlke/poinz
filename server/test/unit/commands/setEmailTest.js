import {v4 as uuid} from 'uuid';
import testUtils from '../testUtils';
import processorFactory from '../../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers from '../../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../../src/eventHandlers/eventHandlers';

test('Should produce emailSet event', async () => {
  const {processor, roomId, userId} = await prep();

  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'setEmail',
      payload: {
        userId: userId,
        email: 'j.doe@gmail.com'
      }
    },
    userId
  ).then((producedEvents) => {
    expect(producedEvents).toBeDefined();
    expect(producedEvents.length).toBe(1);

    const emailSetEvent = producedEvents[0];
    testUtils.assertValidEvent(emailSetEvent, commandId, roomId, userId, 'emailSet');
    expect(emailSetEvent.payload.email).toEqual('j.doe@gmail.com');
    expect(emailSetEvent.payload.userId).toEqual(userId);
  });
});

test('Should store email', async () => {
  const {processor, roomId, userId, mockRoomsStore} = await prep();
  return processor(
    {
      id: uuid(),
      roomId: roomId,
      name: 'setEmail',
      payload: {
        userId: userId,
        email: 'mikey.mouse@hotmail.com'
      }
    },
    userId
  )
    .then(() => mockRoomsStore.getRoomById(roomId))
    .then((room) =>
      expect(room.getIn(['users', userId, 'email'])).toEqual('mikey.mouse@hotmail.com')
    );
});

describe('preconditions', () => {
  test('Should throw if userId does not match', async () => {
    const {processor, roomId, userId} = await prep();
    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'setEmail',
          payload: {
            userId: 'unknown',
            email: 'm.mouse@gmail.com'
          }
        },
        userId
      )
    ).rejects.toThrow('Can only set email for own user!');
  });

  test('Should throw if given email does not match format', async () => {
    const {processor, roomId, userId} = await prep();

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'setEmail',
          payload: {
            userId: userId,
            email: 'is not a email'
          }
        },
        userId
      )
    ).rejects.toThrow('Format validation failed (must be a valid email-address) in /payload/email');
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
