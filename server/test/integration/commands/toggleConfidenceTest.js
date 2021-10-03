import {v4 as uuid} from 'uuid';

import {prepTwoUsersInOneRoomWithOneStory} from '../../unit/testUtils';

test('Should produce confidenceOn and confidenceOff events', async () => {
  const {roomId, userIdOne: userId, processor} = await prepTwoUsersInOneRoomWithOneStory();
  const commandId = uuid();

  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'toggleConfidence',
      payload: {}
    },
    userId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'confidenceOn');
  expect(room.withConfidence).toBe(true);

  const commandId2 = uuid();
  const {producedEvents: producedEvents2, room: room2} = await processor(
    {
      id: commandId2,
      roomId: roomId,
      name: 'toggleConfidence',
      payload: {}
    },
    userId
  );

  expect(producedEvents2).toMatchEvents(commandId2, roomId, 'confidenceOff');
  expect(room2.withConfidence).toBe(false);
});
