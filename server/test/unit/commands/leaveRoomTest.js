import {v4 as uuid} from 'uuid';

import {EXPECT_UUID_MATCHING, prepTwoUsersInOneRoomWithOneStory} from '../testUtils';

test('Should produce leftRoom event', async () => {
  const {userIdTwo, processor, roomId} = await prepTwoUsersInOneRoomWithOneStory();
  const commandId = uuid();

  return processor(
    {
      id: commandId,
      roomId,
      name: 'leaveRoom',
      payload: {
        userId: userIdTwo
      }
    },
    userIdTwo
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'leftRoom');

    const [leftRoomEvent] = producedEvents;

    expect(leftRoomEvent.payload.userId).toEqual(userIdTwo);

    expect(room.users[userIdTwo]).toBeUndefined();
    expect(Object.values(room.users).length).toBe(1);
  });
});

test('Should produce connectionLost event', async () => {
  const {userIdTwo, processor, roomId} = await prepTwoUsersInOneRoomWithOneStory();
  const commandId = uuid();

  return processor(
    {
      id: commandId,
      roomId,
      name: 'leaveRoom',
      payload: {
        userId: userIdTwo,
        connectionLost: true
      }
    },
    userIdTwo
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'connectionLost');

    const [connectionLostEvent] = producedEvents;

    expect(connectionLostEvent.payload.userId).toEqual(userIdTwo);

    expect(room.users[userIdTwo]).toBeDefined();
    expect(room.users[userIdTwo]).toMatchObject({
      disconnected: true,
      id: EXPECT_UUID_MATCHING,
      username: 'secondUser'
    });
    expect(Object.values(room.users).length).toBe(2);
  });
});

describe('preconditions', () => {
  test('Should throw if userIds do not match', async () => {
    const {userIdOne, userIdTwo, processor, roomId} = await prepTwoUsersInOneRoomWithOneStory();
    const commandId = uuid();
    return expect(
      processor(
        {
          id: commandId,
          roomId,
          name: 'leaveRoom',
          payload: {
            userId: userIdTwo
          }
        },
        userIdOne
      )
    ).rejects.toThrow(
      'Precondition Error during "leaveRoom": Can only leave if userId in command payload matches!'
    );
  });
});
