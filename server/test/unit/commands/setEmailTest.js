import {v4 as uuid} from 'uuid';
import {prepOneUserInOneRoom} from '../testUtils';

test('Should produce emailSet event', async () => {
  const {processor, roomId, userId} = await prepOneUserInOneRoom();

  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'setEmail',
      payload: {
        email: 'j.doe@gmail.com'
      }
    },
    userId
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'emailSet');

    const [emailSetEvent] = producedEvents;

    expect(emailSetEvent.payload.email).toEqual('j.doe@gmail.com');
    expect(emailSetEvent.userId).toEqual(userId);

    expect(room.users[userId].email).toEqual('j.doe@gmail.com');
  });
});

describe('preconditions', () => {
  test('Should throw if given email does not match format', async () => {
    const {processor, roomId, userId} = await prepOneUserInOneRoom();

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'setEmail',
          payload: {
            email: 'is not a email'
          }
        },
        userId
      )
    ).rejects.toThrow('Format validation failed (must be a valid email-address) in /payload/email');
  });

  test('Should fail, if userId does not match user in room', async () => {
    const {processor, roomId} = await prepOneUserInOneRoom();
    const commandId = uuid();
    const nonMatchingUserId = uuid();

    return expect(
      processor(
        {
          id: commandId,
          roomId: roomId,
          name: 'setEmail',
          payload: {
            email: 'test@test.com'
          }
        },
        nonMatchingUserId
      )
    ).rejects.toThrow(
      /Precondition Error during "setEmail": Given user .* does not belong to room .*/
    );
  });
});
