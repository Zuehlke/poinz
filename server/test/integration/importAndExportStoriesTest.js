import {promises as fs} from 'fs';
import path from 'path';
import url from 'url';

import uuid from '../../src/uuid.js';
import {prepOneUserInOneRoom, textToCsvDataUrl} from '../testUtils.js';
import {mapRoomExportDto} from '../../src/restApi/dtoMapper.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

test('import stories with keys (from csv) and successfully export them as json', async () => {
  const {userId, roomId, processor, mockRoomsStore} = await prepOneUserInOneRoom();

  mockRoomsStore.manipulate((room) => {
    return room;
  });

  // --  import stories from csv
  const csvContent = await fs.readFile(path.join(__dirname, '../testJiraIssueExport.csv'), 'utf-8');
  const dataUrl = textToCsvDataUrl(csvContent);
  const commandId = uuid();
  const {room} = await processor(
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

  expect(room.stories).toBeDefined();
  expect(room.stories.length).toBe(4);

  // --  "export"  (call Dto mapper like in rest.js)
  const roomExport = mapRoomExportDto(room);
  expect(roomExport.stories.length).toBe(4);
  expect(roomExport.stories[2]).toMatchObject({
    title: 'SMRGR-2643 timezone from AWST to HKT/SGT',
    key: 'SMRGR-2643', // important that "key" property is exported as well
    estimations: []
  });
});

test('correctly handle already present stories (manually added stories before csv import)', async () => {
  const {userId, roomId, processor} = await prepOneUserInOneRoom();

  // --  add a story
  const {room: roomAfterStoryAdded} = await processor(
    {
      id: uuid(),
      roomId,
      name: 'addStory',
      payload: {
        title: 'SuperStory 232',
        description: 'This will be awesome'
      }
    },
    userId
  );
  expect(roomAfterStoryAdded.stories.length).toBe(1);
  expect(roomAfterStoryAdded.stories[0].key).toBeUndefined(); // manually / normally  added stories don't have the "key" property set

  // --  import stories from csv
  const csvContent = await fs.readFile(path.join(__dirname, '../testJiraIssueExport.csv'), 'utf-8');
  const dataUrl = textToCsvDataUrl(csvContent);
  const commandId = uuid();
  const {room} = await processor(
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

  expect(room.stories).toBeDefined();
  expect(room.stories.length).toBe(1 + 4); // one manually added, four imported

  // --  "export"  (call Dto mapper like in rest.js)
  const roomExport = mapRoomExportDto(room);
  expect(roomExport.stories.length).toBe(5);
  expect(roomExport.stories[0].key).toBeUndefined();
  expect(roomExport.stories[3]).toMatchObject({
    title: 'SMRGR-2643 timezone from AWST to HKT/SGT',
    key: 'SMRGR-2643', // important that "key" property is exported as well
    estimations: []
  });
});
