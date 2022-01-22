import uuid from '../../../src/uuid';
import {prepOneUserInOneRoom} from '../../unit/testUtils';

test('Should produce avatarSet event', async () => {
  const {processor, roomId, userId} = await prepOneUserInOneRoom();

  const commandId = uuid();
  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'setAvatar',
      payload: {
        avatar: 3
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'avatarSet');

  const [avatarSetEvent] = producedEvents;

  expect(avatarSetEvent.payload.avatar).toEqual(3);
  expect(avatarSetEvent.userId).toEqual(userId);

  expect(room.users[0].avatar).toEqual(3);
});

describe('preconditions', () => {
  test('Should throw if given avatar in payload is not a number', async () => {
    const {processor, roomId, userId} = await prepOneUserInOneRoom();

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'setAvatar',
          payload: {
            avatar: '4' // <<-  a string
          }
        },
        userId
      )
    ).rejects.toThrow(
      'Command validation Error during "setAvatar": Invalid type: string (expected number) in /payload/avatar'
    );
  });
});
