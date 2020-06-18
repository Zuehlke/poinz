import {v4 as uuid} from 'uuid';
import {prepOneUserInOneRoom} from '../testUtils';

test('toggleExclude  -> excluded', async () => {
  const {userId, processor, roomId} = await prepOneUserInOneRoom();

  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId,
      name: 'toggleExclude',
      payload: {}
    },
    userId
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'excludedFromEstimations');

    const [excludedFromEstimationsEvent] = producedEvents;

    expect(excludedFromEstimationsEvent.userId).toEqual(userId);

    // flag is set on user in room
    expect(room.users[userId].excluded).toBe(true);
  });
});

test('toggleExclude  -> included', async () => {
  const {userId, processor, roomId, mockRoomsStore} = await prepOneUserInOneRoom();

  mockRoomsStore.manipulate((room) => room.setIn(['users', userId, 'excluded'], true));

  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId,
      name: 'toggleExclude',
      payload: {}
    },
    userId
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'includedInEstimations');

    const [includedInEstimationsEvent] = producedEvents;

    expect(includedInEstimationsEvent.userId).toEqual(userId);

    // flag is set to false on user in room
    expect(room.users[userId].excluded).toBe(false);
  });
});

describe('precondition', () => {
  test('Should fail, if userId does not match user in room', async () => {
    const {processor, roomId} = await prepOneUserInOneRoom();
    const commandId = uuid();
    const nonMatchingUserId = uuid();

    return expect(
      processor(
        {
          id: commandId,
          roomId: roomId,
          name: 'toggleExclude',
          payload: {}
        },
        nonMatchingUserId
      )
    ).rejects.toThrow(
      /Precondition Error during "toggleExclude": Given user .* does not belong to room .*/
    );
  });
});
