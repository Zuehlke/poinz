import uuid from '../../../src/uuid';
import {prepOneUserInOneRoom} from '../../unit/testUtils';

test('Should produce usernameSet event', async () => {
  const {processor, roomId, userId} = await prepOneUserInOneRoom();
  const commandId = uuid();
  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'setUsername',
      payload: {
        username: 'John.Doe'
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'usernameSet');

  const [usernameSetEvent] = producedEvents;

  expect(usernameSetEvent.payload.username).toEqual('John.Doe');
  expect(usernameSetEvent.userId).toEqual(userId);

  expect(room.users[0].username).toEqual('John.Doe');
});

describe('preconditions', () => {
  test('Should fail, if username is too short (less than 3 chars)', async () => {
    const {processor, roomId, userId} = await prepOneUserInOneRoom();
    const commandId = uuid();

    return expect(
      processor(
        {
          id: commandId,
          roomId: roomId,
          name: 'setUsername',
          payload: {
            username: 'ab'
          }
        },
        userId
      )
    ).rejects.toThrow('Format validation failed (must be a valid username) in /payload/username');
  });

  test('Should fail, if username is too long (more than 80 chars)', async () => {
    const {processor, roomId, userId} = await prepOneUserInOneRoom();
    const commandId = uuid();

    return expect(
      processor(
        {
          id: commandId,
          roomId: roomId,
          name: 'setUsername',
          payload: {
            username: 'b'.repeat(81)
          }
        },
        userId
      )
    ).rejects.toThrow('Format validation failed (must be a valid username) in /payload/username');
  });
});
