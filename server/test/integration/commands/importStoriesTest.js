import {promises as fs} from 'fs';
import path from 'path';

import uuid from '../../../src/uuid';
import {prepOneUserInOneRoom, textToCsvDataUrl} from '../../unit/testUtils';

test('Should produce storyAdded events for all stories in data', async () => {
  const csvContent = await fs.readFile(
    path.join(__dirname, '../../unit/testJiraIssueExport.csv'),
    'utf-8'
  );
  const dataUrl = textToCsvDataUrl(csvContent);

  const {userId, roomId, processor} = await prepOneUserInOneRoom();

  const commandId = uuid();
  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId,
      name: 'importStories',
      payload: {
        data: dataUrl
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(
    commandId,
    roomId,
    'storyAdded',
    'storyAdded',
    'storyAdded',
    'storyAdded',
    'storySelected'
  );

  const storyAddedEvent1 = producedEvents[0];
  const storySelectedEvent = producedEvents[4];

  expect(storyAddedEvent1.payload).toMatchObject({
    title: 'SMRGR-6275 Something something Summary',
    description: 'His account can be deactivated end of July.',
    estimations: {}
  });
  expect(storySelectedEvent.payload).toEqual({
    storyId: storyAddedEvent1.payload.storyId
  });

  expect(room.stories.length).toBe(4);
});

test('Should produce importFailed event', async () => {
  const {userId, roomId, processor} = await prepOneUserInOneRoom();

  const dataUrl = textToCsvDataUrl('this,is,a,csv\nbut,not,expected format,');

  const commandId = uuid();
  const {producedEvents} = await processor(
    {
      id: commandId,
      roomId,
      name: 'importStories',
      payload: {
        data: dataUrl
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'importFailed');

  const [importFailedEvent] = producedEvents;

  expect(importFailedEvent.payload.message).toMatch(/No Stories in payload/);
});

test('Should produce importFailed event: format error', async () => {
  const {userId, roomId, processor} = await prepOneUserInOneRoom();

  const base64data = Buffer.from('this,is,a,csv\nbut,not,expected format\n').toString('base64');
  const dataUrl = 'data:text/csv;base64,' + base64data;

  const commandId = uuid();
  const {producedEvents} = await processor(
    {
      id: commandId,
      roomId,
      name: 'importStories',
      payload: {
        data: dataUrl
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'importFailed');

  const [importFailedEvent] = producedEvents;

  expect(importFailedEvent.payload.message).toMatch(
    /Could not parse to stories Error: Got errors from parsing or input got truncated/
  );
});

test('should throw on invalid command payload format', async () => {
  const {userId, roomId, processor} = await prepOneUserInOneRoom();

  return expect(
    processor(
      {
        id: uuid(),
        roomId: roomId,
        name: 'importStories',
        payload: {
          data: 'this is not a data url, beginning with  data:text/csv;base64,'
        }
      },
      userId
    )
  ).rejects.toThrow(
    /Format validation failed \(must be a valid text\/csv data url\) in \/payload\/data/
  );
});

test('Should fix title and description length:', async () => {
  const {userId, roomId, processor} = await prepOneUserInOneRoom();

  const stories = [
    ['ISSUE-1', 'first story', 'description'].join(','),
    ['ISSUE-2', 'second story' + '-'.repeat(130), 'description' + '-'.repeat(2010)].join(',')
  ];
  const base64data = Buffer.from('issue,title,descr\n' + stories.join('\n')).toString('base64');
  const dataUrl = 'data:text/csv;base64,' + base64data;

  const commandId = uuid();
  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId,
      name: 'importStories',
      payload: {
        data: dataUrl
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(
    commandId,
    roomId,
    'storyAdded',
    'storyAdded',
    'storySelected'
  );

  const storyAddedEvent1 = producedEvents[0];
  const storyAddedEvent2 = producedEvents[1];
  const storySelectedEvent = producedEvents[2];

  expect(storyAddedEvent1.payload).toMatchObject({
    title: 'ISSUE-1 first story',
    description: 'description',
    estimations: {}
  });
  expect(storyAddedEvent2.payload).toMatchObject({
    title: 'ISSUE-2 second story' + '-'.repeat(100 - 20),
    description: 'description' + '-'.repeat(2000 - 11),
    estimations: {}
  });
  expect(storySelectedEvent.payload).toEqual({
    storyId: storyAddedEvent1.payload.storyId
  });

  expect(room.stories.length).toBe(2);
});
