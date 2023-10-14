import uuid from '../../src/uuid.js';
import inMemoryRoomsStore from '../../src/store/inMemoryRoomsStore.js';

test('should save and retrieve a room', async () => {
  const roomId = uuid();
  await inMemoryRoomsStore.init();

  const roomObject = {
    id: roomId,
    arbitrary: 'data',
    nestedArray: [{a: 'some'}],
    nestedObject: {
      props: 1,
      properties: 'dklklö'
    }
  };

  await inMemoryRoomsStore.saveRoom(roomObject);
  const retr = await inMemoryRoomsStore.getRoomById(roomId);

  expect(retr).toEqual(roomObject);
});

test('should "detach" saved object', async () => {
  const roomId = uuid();
  await inMemoryRoomsStore.init();

  const roomObject = {
    id: roomId,
    arbitrary: 'data'
  };

  await inMemoryRoomsStore.saveRoom(roomObject);

  // manipulate stored room object "outside" the store
  roomObject.newAttribute = 'some value';
  const retr = await inMemoryRoomsStore.getRoomById(roomId);
  expect(retr !== roomObject);
  expect(Object.prototype.hasOwnProperty.call(retr, 'newAttribute')).toBe(false);

  // manipulate retrieved room object "outside" thestore
  retr.secondNewAttribtue = 'some nice value';
  const retr2 = await inMemoryRoomsStore.getRoomById(roomId);
  expect(retr2 !== retr);
  expect(Object.prototype.hasOwnProperty.call(retr2, 'secondNewAttribtue')).toBe(false);
});

test('should return undefined in unknown roomId', async () => {
  await inMemoryRoomsStore.init();
  return expect(inMemoryRoomsStore.getRoomById(uuid())).resolves.toBeUndefined();
});

test('has housekeeping() function', async () => {
  // just assert that roomsStore interface is complete. currently a no-op for inMemoryRoomsStore
  await inMemoryRoomsStore.init();
  const houseKeepingReport = await inMemoryRoomsStore.housekeeping();

  expect(houseKeepingReport.markedForDeletion.length).toBe(0);
  expect(houseKeepingReport.deleted.length).toBe(0);
});

test('has getStoreType() function', async () => {
  await inMemoryRoomsStore.init();
  const storeTypeString = inMemoryRoomsStore.getStoreType();
  expect(storeTypeString).toBe('InMemoryRoomsStore');
});

async function addAHundredRooms() {
  for (let r = 0; r < 100; r++) {
    const roomObject = {
      id: uuid(),
      stories: [
        {
          id: '7sd58ihu7arg6qfazce67',
          title: 'Welcome to your Poinz room!',
          estimations: {},
          createdAt: 1697271585071,
          description: 'This is a sample story that we already created for you.'
        }
      ],
      selectedStory: '7sd58ihu7arg6qfazce67',
      autoReveal: true,
      withConfidence: false,
      passwordProtected: false,
      users: [
        {
          disconnected: r % 2 === 0,
          id: 'rd0zb3s5xvdkzh4a7jypj',
          avatar: 5,
          username: 'Sergio'
        }
      ]
    };

    await inMemoryRoomsStore.saveRoom(roomObject);
  }
}

test('getRooms (all)', async () => {
  await inMemoryRoomsStore.init();
  await addAHundredRooms();
  const rooms = await inMemoryRoomsStore.getRooms(4000, 0, false);
  const roomsArray = Object.values(rooms);
  expect(roomsArray.length).toBe(100);
});

test('getRooms (limited and with offset)', async () => {
  await inMemoryRoomsStore.init();
  await addAHundredRooms();
  const rooms = await inMemoryRoomsStore.getRooms(20, 10, false);
  const roomsArray = Object.values(rooms);
  expect(roomsArray.length).toBe(20);
});

test('getRooms (active only)', async () => {
  await inMemoryRoomsStore.init();
  await addAHundredRooms();
  const rooms = await inMemoryRoomsStore.getRooms(5000, 0, true);
  const roomsArray = Object.values(rooms);
  expect(roomsArray.length).toBe(50); // only every other (second) room, with a non-disconnected user

  const allAreActive = roomsArray.every((r) => r.users.some((u) => !u.disconnected));
  expect(allAreActive).toBe(true);
});
