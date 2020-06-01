import {v4 as uuid} from 'uuid';
import {assertEvents, prepOneUserInOneRoom} from '../testUtils';

test('Should produce usernameSet event', async () => {
  const {processor, roomId, userId} = await prepOneUserInOneRoom();
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
  ).then(({producedEvents, room}) => {
    const [usernameSetEvent] = assertEvents(producedEvents, commandId, roomId, 'usernameSet');

    expect(usernameSetEvent.payload.username).toEqual('John Doe');
    expect(usernameSetEvent.payload.userId).toEqual(userId);

    expect(room.users[userId].username).toEqual('John Doe');
  });
});

describe('preconditions', () => {
  test('Should throw if userId does not match', async () => {
    const {processor, roomId, userId} = await prepOneUserInOneRoom();
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
