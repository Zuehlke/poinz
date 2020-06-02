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
      payload: {
        userId
      }
    },
    userId
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'excludedFromEstimations');

    const [excludedFromEstimationsEvent] = producedEvents;

    expect(excludedFromEstimationsEvent.payload.userId).toEqual(userId);

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
      payload: {
        userId
      }
    },
    userId
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'includedInEstimations');

    const [includedInEstimationsEvent] = producedEvents;

    expect(includedInEstimationsEvent.payload.userId).toEqual(userId);

    // flag is set to false on user in room
    expect(room.users[userId].excluded).toBe(false);
  });
});

test('Should throw if userId does not match (another user wants to mark somebody else as excluded)', async () => {
  const {userId, processor, roomId} = await prepOneUserInOneRoom();
  return expect(
    processor(
      {
        id: uuid(),
        roomId: roomId,
        name: 'toggleExclude',
        payload: {
          userId: 'unknown'
        }
      },
      userId
    )
  ).rejects.toThrow('Can only exclude or include own user from estimations');
});
