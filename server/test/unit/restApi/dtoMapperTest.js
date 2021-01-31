import {mapAppStatusDto, mapRoomExportDto, mapRoomStateDto} from '../../../src/restApi/dtoMapper';

const exampleRoom = {
  id: '1b370339-a8f9-411c-8a42-540609a2bcdb',
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
};

test('mapAppStatusDto: basic', () => {
  const allRooms = [exampleRoom];

  const appStatusDto = mapAppStatusDto(allRooms, 'MockRoomsStore for unit tests');

  expect(appStatusDto).toMatchObject({
    rooms: [{storyCount: 3, userCount: 2, userCountDisconnected: 0}],
    roomCount: 1,
    uptime: expect.any(Number),
    storeInfo: 'MockRoomsStore for unit tests'
  });
});

test('mapAppStatusDto: handles empty', () => {
  const appStatusDto = mapAppStatusDto([], 'MockRoomsStore for unit tests');

  expect(appStatusDto).toMatchObject({
    rooms: [],
    roomCount: 0,
    uptime: expect.any(Number),
    storeInfo: 'MockRoomsStore for unit tests'
  });
});

test('mapRoomExportDto: basic', async () => {
  const roomExportDto = mapRoomExportDto(exampleRoom);

  expect(roomExportDto).toMatchObject({
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

test('mapRoomExportDto: handles undefined', async () => {
  const roomExportDto = mapRoomExportDto(undefined);

  expect(roomExportDto).toBeUndefined();
});

test('mapRoomStateDto: basic', async () => {
  const roomExportDto = mapRoomStateDto({
    ...exampleRoom,
    autoReveal: false,
    password: {
      hash: 'something',
      salt: 'else'
    }
  });

  expect(roomExportDto).toMatchObject({
    autoReveal: false,
    id: '1b370339-a8f9-411c-8a42-540609a2bcdb',
    selectedStory: 'a4ed287c-1cfd-49d4-b237-577b7190e76e',
    stories: exampleRoom.stories,
    users: exampleRoom.users,
    passwordProtected: true
  });

  expect(roomExportDto.password).toBeUndefined();
});

test('mapRoomStateDto: handles undefined', async () => {
  const roomExportDto = mapRoomStateDto(undefined);

  expect(roomExportDto).toBeUndefined();
});
