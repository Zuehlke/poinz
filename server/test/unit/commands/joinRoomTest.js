import {v4 as uuid} from 'uuid';

import testUtils from '../testUtils';
import processorFactory from '../../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers from '../../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../../src/eventHandlers/eventHandlers';

test('Should produce 3 events for a already existing room', async () => {
  const {userId, processor, roomId} = await prep();
  const commandId = uuid();

  return processor(
    {
      id: commandId,
      roomId,
      name: 'joinRoom',
      payload: {
        userId,
        email: 'j.doe@gmail.com',
        username: 'something'
      }
    },
    userId
  ).then((producedEvents) => {
    expect(producedEvents).toBeDefined();
    expect(producedEvents.length).toBe(3);

    const joinedRoomEvent = producedEvents[0];
    testUtils.assertValidEvent(joinedRoomEvent, commandId, roomId, userId, 'joinedRoom');
    expect(joinedRoomEvent.payload.userId).toEqual(userId);
    expect(joinedRoomEvent.payload.users[userId]).toEqual({
      email: 'j.doe@gmail.com',
      id: userId,
      username: 'something'
    });

    const usernameSetEvent = producedEvents[1];
    testUtils.assertValidEvent(usernameSetEvent, commandId, roomId, userId, 'usernameSet');
    expect(usernameSetEvent.payload.userId).toEqual(userId);
    expect(usernameSetEvent.payload.username).toEqual('something');

    const emailSet = producedEvents[2];
    testUtils.assertValidEvent(emailSet, commandId, roomId, userId, 'emailSet');
    expect(emailSet.payload.userId).toEqual(userId);
    expect(emailSet.payload.email).toEqual('j.doe@gmail.com');
  });
});

test('Should be able to join room by alias', async () => {
  const {userId, processor, alias} = await prep();

  return processor(
    {
      id: uuid(),
      roomId: alias, // <- this is not the roomId but the alias
      name: 'joinRoom',
      payload: {
        userId: userId,
        email: 'j.doe@gmail.com',
        username: 'something'
      }
    },
    userId
  ).then((producedEvents) => {
    expect(producedEvents).toBeDefined();
    expect(producedEvents.length).toBe(3);

    const joinedRoomEvent = producedEvents[0];
    expect(joinedRoomEvent.payload.alias).toEqual('custom.room.alias');
  });
});

/**
 * prepares mock room store with one user and one story
 */
async function prep() {
  const userId = uuid();
  const roomId = 'rm_' + uuid();
  const alias = 'custom.room.alias';

  const mockRoomsStore = testUtils.newMockRoomsStore({
    id: roomId,
    alias,
    users: {
      user123: {
        id: 'user123',
        username: 'creator'
      }
    },
    stories: {
      abc: {
        id: 'abc',
        title: 'some',
        estimations: {}
      }
    }
  });
  const processor = processorFactory(commandHandlers, eventHandlers, mockRoomsStore);

  return {userId, roomId, processor, mockRoomsStore, alias};
}
