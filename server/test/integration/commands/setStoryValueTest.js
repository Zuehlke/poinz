import uuid from '../../../src/uuid';
import {prepTwoUsersInOneRoomWithOneStory} from '../../testUtils.js';

test('new unestimated story', async () => {
  const {roomId, storyId, userIdOne, processor} = await prepTwoUsersInOneRoomWithOneStory();

  const commandId = uuid();

  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId,
      name: 'setStoryValue',
      payload: {
        storyId,
        value: 5
      }
    },
    userIdOne
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'storyValueSet');

  expect(room.stories).toMatchObject([
    {
      consensus: 5, // <<- consensus set
      description: 'This will be awesome',
      estimations: {}, // <<-  this is obviously still empty, no one did estimate.
      revealed: true, // <<-  story gets revealed when setting consensus manually
      title: 'new super story'
    }
  ]);
});
