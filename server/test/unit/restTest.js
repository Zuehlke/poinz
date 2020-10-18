import {buildRoomExportObject, buildStatusObject} from '../../src/rest';
import {newMockRoomsStore} from './testUtils';

test('buildStatusObject', async () => {
  const roomsStore = newMockRoomsStore({
    id: 'super-room',
    created: 123456989809,
    lastActivity: 123456989810,
    markedForDeletion: false,
    stories: [
      {
        id: 'b60212ec-4318-4cce-bc24-c1ff30a2dcf1',
        title: 'the one story',
        createdAt: 1234567890
      }
    ],
    users: [
      {id: 'ab0777f2-2472-45df-8d4a-b1e64f87d8ce', avatar: 0},
      {id: '664deb13-4a88-4db6-91f6-ef3bb533a3fc', disconnected: true, avatar: 0}
    ]
  });

  const statusObject = await buildStatusObject(roomsStore);

  expect(statusObject).toMatchObject({
    rooms: [{storyCount: 1, userCount: 2, userCountDisconnected: 1}],
    roomCount: 1,
    uptime: expect.any(Number),
    storeInfo: 'MockRoomsStore for unit tests'
  });
});

test('buildRoomExportObject', async () => {
  const roomId = '1b370339-a8f9-411c-8a42-540609a2bcdb';
  const roomsStore = newMockRoomsStore({
    id: roomId,
    users: [
      {
        id: '8d85c095-87bf-4e8f-9957-1e2b621f83de',
        username: 'Sergio',
        email: 'sergio.trentini@zuehlke.com',
        avatar: 1
      },
      {
        id: '0afab6a7-2b26-4bbc-bb46-294ce255729c',
        username: 'Foxy',
        avatar: 2
      }
    ],
    stories: [
      {
        title: 'second',
        description: 's2 description',
        id: 'cda908b1-bbf9-4b04-8cf7-bf636c5cd8bd',
        estimations: {
          '0afab6a7-2b26-4bbc-bb46-294ce255729c': 3,
          '8d85c095-87bf-4e8f-9957-1e2b621f83de': 3
        },
        createdAt: 1599237099010,
        revealed: true
      },
      {
        title: 'first',
        description: 's1 descr',
        id: 'a4ed287c-1cfd-49d4-b237-577b7190e76e',
        estimations: {
          '0afab6a7-2b26-4bbc-bb46-294ce255729c': 13,
          '8d85c095-87bf-4e8f-9957-1e2b621f83de': 5
        },
        createdAt: 1599237066010,
        revealed: true
      },
      {
        title: 'trashed',
        description: '',
        id: 'b3f1cf71-9d04-4e14-9785-696401552561',
        estimations: {},
        createdAt: 1599544313982,
        trashed: true
      }
    ],
    created: 1599237063876,
    lastActivity: 1599237085043,
    markedForDeletion: false,
    selectedStory: 'a4ed287c-1cfd-49d4-b237-577b7190e76e'
  });

  const roomExport = await buildRoomExportObject(roomsStore, roomId);

  expect(roomExport).toMatchObject({
    roomId: '1b370339-a8f9-411c-8a42-540609a2bcdb',
    exportedAt: expect.any(Number),
    stories: [
      {
        title: 'second',
        description: 's2 description',
        estimations: [
          {
            username: 'Foxy',
            value: 3
          },
          {
            username: 'Sergio',
            value: 3
          }
        ]
      },
      {
        title: 'first',
        description: 's1 descr',
        estimations: [
          {
            username: 'Foxy',
            value: 13
          },
          {
            username: 'Sergio',
            value: 5
          }
        ]
      }
      // export must not include the "trashed" story
    ]
  });
});
