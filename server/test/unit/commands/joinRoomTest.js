import {v4 as uuid} from 'uuid';

import {assertEvents, prepOneUserInOneRoomWithOneStory} from '../testUtils';

test('Should produce 3 events for a already existing room', async () => {
  const {userId, processor, roomId} = await prepOneUserInOneRoomWithOneStory();
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
  ).then(({producedEvents}) => {
    const [joinedRoomEvent, usernameSetEvent, emailSet] = assertEvents(
      producedEvents,
      commandId,
      roomId,
      'joinedRoom',
      'usernameSet',
      'emailSet'
    );

    expect(joinedRoomEvent.payload.userId).toEqual(userId);
    expect(joinedRoomEvent.payload.users[userId]).toMatchObject({
      email: 'j.doe@gmail.com',
      id: userId,
      username: 'something'
    });

    expect(usernameSetEvent.payload.userId).toEqual(userId);
    expect(usernameSetEvent.payload.username).toEqual('something');

    expect(emailSet.payload.userId).toEqual(userId);
    expect(emailSet.payload.email).toEqual('j.doe@gmail.com');
  });
});

test('Should be able to join room by alias', async () => {
  const {userId, processor, mockRoomsStore} = await prepOneUserInOneRoomWithOneStory();
  mockRoomsStore.manipulate((room) => room.set('alias', 'custom.room.alias'));

  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId: 'custom.room.alias', // <- this is not the roomId but the alias
      name: 'joinRoom',
      payload: {
        userId: userId,
        email: 'j.doe@gmail.com',
        username: 'something'
      }
    },
    userId
  ).then(({producedEvents}) => {
    const roomId = producedEvents[0].roomId;
    const [joinedRoomEvent] = assertEvents(
      producedEvents,
      commandId,
      roomId,
      'joinedRoom',
      'usernameSet',
      'emailSet'
    );

    expect(joinedRoomEvent.payload.alias).toEqual('custom.room.alias');
  });
});
