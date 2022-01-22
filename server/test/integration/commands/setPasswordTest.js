import {prepOneUserInOneRoom} from '../../unit/testUtils';
import uuid from '../../../src/uuid';
import {hashRoomPassword} from '../../../src/auth/roomPasswordService';

test('Should produce passwordSet event for room without pw', async () => {
  const {processor, roomId, userId} = await prepOneUserInOneRoom();

  const commandId = uuid();
  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'setPassword',
      payload: {
        password: 'this-is-mynewpassword'
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'passwordSet');

  const [pwSetEvent] = producedEvents;

  expect(pwSetEvent.payload.password).toBeUndefined(); // do not publish passwords to clients!
  expect(pwSetEvent.userId).toEqual(userId);

  expect(room.password.hash).toBeDefined();
  expect(room.password.salt).toBeDefined();
});

test('Should produce passwordSet event for room without pw, LONG password', async () => {
  const {processor, roomId, userId} = await prepOneUserInOneRoom();

  const commandId = uuid();
  const {producedEvents} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'setPassword',
      payload: {
        password: 'b'.repeat(500)
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'passwordSet');
});

test('Should produce passwordSet event for room with pw already set (override old pw)', async () => {
  const {processor, roomId, userId, mockRoomsStore} = await prepOneUserInOneRoom();

  const prevSetPw = hashRoomPassword('some-previously-set-pw');
  mockRoomsStore.manipulate((room) => {
    room.password = prevSetPw;
    return room;
  });

  const commandId = uuid();
  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'setPassword',
      payload: {
        password: 'this-is-mynewpassword'
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'passwordSet');

  const [pwSetEvent] = producedEvents;

  expect(pwSetEvent.payload.password).toBeUndefined(); // do not publish passwords to clients!
  expect(pwSetEvent.userId).toEqual(userId);

  expect(room.password.hash).toBeDefined();
  expect(room.password.hash).not.toEqual(prevSetPw.hash);

  expect(room.password.salt).toBeDefined();
  expect(room.password.salt).not.toEqual(prevSetPw.salt);
});

test('Should produce passwordCleared event for room with pw already set and empty pw in command payload', async () => {
  const {processor, roomId, userId, mockRoomsStore} = await prepOneUserInOneRoom();

  const prevSetPw = hashRoomPassword('some-previously-set-pw');
  mockRoomsStore.manipulate((room) => {
    room.password = prevSetPw;
    return room;
  });

  const commandId = uuid();
  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'setPassword',
      payload: {
        // password property omitted
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'passwordCleared');

  const [passwordClearedEvent] = producedEvents;

  expect(passwordClearedEvent.payload.password).toBeUndefined(); // do not publish passwords to clients!
  expect(passwordClearedEvent.userId).toEqual(userId);

  expect(passwordClearedEvent.password).toBeUndefined();

  expect(room.password).toBeUndefined();
});
