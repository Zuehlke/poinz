import {promises as fs} from 'fs';
import path from 'path';
import {v4 as uuid} from 'uuid';
import {prepOneUserInOneRoom} from '../testUtils';

test('Should produce storyAdded events for all stories in data', async () => {
  const csvContent = await fs.readFile(path.join(__dirname, '../testJiraIssueExport.csv'), 'utf-8');
  const base64data = Buffer.from(csvContent).toString('base64');
  const dataUrl = 'data:text/csv;base64,' + base64data;

  const {userId, roomId, processor} = await prepOneUserInOneRoom();

  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId,
      name: 'importStories',
      payload: {
        data: dataUrl
      }
    },
    userId
  ).then(({producedEvents}) => {
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
      storyId: storyAddedEvent1.payload.id
    });
  });
});

test('Should produce importFailed event', async () => {
  const {userId, roomId, processor} = await prepOneUserInOneRoom();

  const base64data = Buffer.from('this,is,a,csv\nbut,not,expected format,').toString('base64');
  const dataUrl = 'data:text/csv;base64,' + base64data;

  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId,
      name: 'importStories',
      payload: {
        data: dataUrl
      }
    },
    userId
  ).then(({producedEvents}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'importFailed');

    const [importFailedEvent] = producedEvents;

    expect(importFailedEvent.payload.message).toMatch(/No Stories in payload/);
  });
});

test('Should produce importFailed event: format error', async () => {
  const {userId, roomId, processor} = await prepOneUserInOneRoom();

  const base64data = Buffer.from('this,is,a,csv\nbut,not,expected format\n').toString('base64');
  const dataUrl = 'data:text/csv;base64,' + base64data;

  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId,
      name: 'importStories',
      payload: {
        data: dataUrl
      }
    },
    userId
  ).then(({producedEvents}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'importFailed');

    const [importFailedEvent] = producedEvents;

    expect(importFailedEvent.payload.message).toMatch(
      /Could not parse to stories Error: Got errors from parsing or input got truncated/
    );
  });
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
