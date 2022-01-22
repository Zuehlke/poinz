import uuid from '../../../src/uuid';
import {prepOneUserInOneRoom} from '../../unit/testUtils';

test('Should produce emailSet event', async () => {
  const {processor, roomId, userId} = await prepOneUserInOneRoom();

  const commandId = uuid();
  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'setEmail',
      payload: {
        email: 'j.doe@gmail.com'
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'emailSet');

  const [emailSetEvent] = producedEvents;

  expect(emailSetEvent.payload.email).toEqual('j.doe@gmail.com');
  expect(emailSetEvent.payload.emailHash).toEqual('8115b7da7fff37aeaec18779411a1042');
  expect(emailSetEvent.userId).toEqual(userId);

  expect(room.users[0].email).toEqual('j.doe@gmail.com');
  expect(room.users[0].emailHash).toEqual('8115b7da7fff37aeaec18779411a1042');
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

  test('Should throw if given email has too many characters', async () => {
    const {processor, roomId, userId} = await prepOneUserInOneRoom();

    const domainname = '@test.com';
    const usernameLength = 254 - domainname.length;

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'setEmail',
          payload: {
            email: 'a'.repeat(usernameLength + 1) + domainname
          }
        },
        userId
      )
    ).rejects.toThrow(
      'Format validation failed (string must not be more than 254 characters) in /payload/email'
    );
  });
});
