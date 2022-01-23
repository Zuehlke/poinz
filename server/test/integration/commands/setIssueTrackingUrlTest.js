import uuid from '../../../src/uuid';
import {prepTwoUsersInOneRoomWithOneStory} from '../../unit/testUtils';

test('Should produce issueTrackingUrlSet event', async () => {
  const {roomId, userIdOne: userId, processor} = await prepTwoUsersInOneRoomWithOneStory();
  const commandId = uuid();

  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'setIssueTrackingUrl',
      payload: {
        url: 'https://jira.my-super-company.com/browser/{ISSUE}'
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'issueTrackingUrlSet');
  expect(room.issueTrackingUrl).toBe(producedEvents[0].payload.url);
});

test('Should produce issueTrackingUrlSet event for an empty string', async () => {
  const {roomId, userIdOne: userId, processor} = await prepTwoUsersInOneRoomWithOneStory();
  const commandId = uuid();

  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'setIssueTrackingUrl',
      payload: {
        url: ''
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'issueTrackingUrlSet');
  expect(room.issueTrackingUrl).toBeUndefined();
});

test('Should produce issueTrackingUrlSet event for property not set', async () => {
  const {roomId, userIdOne: userId, processor} = await prepTwoUsersInOneRoomWithOneStory();
  const commandId = uuid();

  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'setIssueTrackingUrl',
      payload: {}
    },
    userId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'issueTrackingUrlSet');
  expect(room.issueTrackingUrl).toBeUndefined();
});
