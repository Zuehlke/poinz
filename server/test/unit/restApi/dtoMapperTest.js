import {
  mapAppStatusDto,
  mapRoomExportDto,
  mapRoomStateDto
} from '../../../src/restApi/dtoMapper.js';

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

test('mapRoomExportDto: with confidence', async () => {
  const exampleRoomWithConfidence = {
    id: 'cykbubk243leltd6p43ix',
    users: [
      {
        disconnected: false,
        id: 'rd0zb3s5xvdkzh4a7jypj',
        avatar: 15,
        username: 'Sergio',
        email: 'set@zuehlke.com',
        emailHash: 'd2bb0fb7ae7e208f0a2384ec08d708ef'
      },
      {
        id: 'i1wl7azsnna9jjsx3-fdf',
        username: 'SergioFF',
        avatar: 0,
        disconnected: false,
        excluded: false
      }
    ],
    stories: [
      {
        id: 'uauwcveac7xg0d6bx9uay',
        title: 'Welcome to your PoinZ room!',
        estimations: {
          'i1wl7azsnna9jjsx3-fdf': 1,
          rd0zb3s5xvdkzh4a7jypj: 2
        },
        createdAt: 1668846951691,
        description: 'This is a sample story that we already created for you',
        revealed: true,
        estimationsConfidence: {
          rd0zb3s5xvdkzh4a7jypj: 1,
          'i1wl7azsnna9jjsx3-fdf': -1
        }
      }
    ],
    created: 1668846951691,
    autoReveal: true,
    withConfidence: true,
    selectedStory: 'uauwcveac7xg0d6bx9uay',
    lastActivity: 1668847150040,
    markedForDeletion: false
  };

  const roomExportDto = mapRoomExportDto(exampleRoomWithConfidence);

  expect(roomExportDto).toMatchObject({
    roomId: 'cykbubk243leltd6p43ix',
    exportedAt: expect.any(Number)
  });

  expect(roomExportDto.stories[0]).toMatchObject({
    title: 'Welcome to your PoinZ room!',
    estimations: [
      {
        username: 'SergioFF',
        value: 1,
        userId: 'i1wl7azsnna9jjsx3-fdf',
        confidence: -1
      },
      {
        username: 'Sergio',
        value: 2,
        userId: 'rd0zb3s5xvdkzh4a7jypj',
        confidence: 1
      }
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
