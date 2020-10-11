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
  const {userId, processor, roomId, mockStore} = await prepOneUserInOneRoom();

  mockStore.manipulate((room) => {
    room.users[userId].excluded = true;
    return room;
  });

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
