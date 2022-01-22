import uuid from '../../src/uuid';

// we want to test with our real command- and event handlers.
import commandHandlers, {baseCommandSchema} from '../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../src/eventHandlers/eventHandlers';
import commandProcessorFactory from '../../src/commandProcessor';
import {roomSchemaValidatorFactory} from '../../src/validation/schemaValidators';

const validateRoom = roomSchemaValidatorFactory();

/**
 * jest string matcher that will match our uuids (= unique identifiers) in use.  These are either the "old" uuidv4 or the "new" nanoid
 * @type {any}
 */
export const EXPECT_UUID_MATCHING = expect.stringMatching(
  new RegExp(
    /^([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|[-a-z0-9_]{21})$/
  )
);

export function textToCsvDataUrl(csvContent) {
  const base64data = Buffer.from(csvContent).toString('base64');
  return 'data:text/csv;base64,' + base64data;
}

/**
 * our mock roomsStore contains only one room.
 * commandProcessor will load this room (if set), and store back manipulated room.
 *
 * room object can be manually manipulated to prepare for different scenarios.
 *
 * @param {object} [initialRoom] If not set, room will not exists in store.
 */
export function newMockRoomsStore(initialRoom) {
  let room;

  if (initialRoom) {
    validateRoom(initialRoom); // just make sure that all of our tests work with valid room objects!
    room = detatchObject(initialRoom);
  }

  return {
    getRoomById: (id) => {
      if (!room || room.id !== id) {
        return Promise.resolve(undefined);
      }
      return Promise.resolve(detatchObject(room));
    },
    saveRoom: (rm) => {
      validateRoom(rm);
      room = detatchObject(rm);
      return Promise.resolve();
    },
    getAllRooms: () => {
      if (!room) {
        return Promise.resolve({});
      }

      return Promise.resolve({
        [room.id]: detatchObject(room)
      });
    },
    manipulate: (fn) => {
      const modifiedRoom = fn(room);
      if (!modifiedRoom) {
        throw new Error('Your function in "manipulate" must return the room!');
      }
      validateRoom(modifiedRoom);
      room = modifiedRoom;
    },
    getStoreType: () => 'MockRoomsStore for unit tests'
  };
}

const detatchObject = (obj) => JSON.parse(JSON.stringify(obj));

export function prepEmpty() {
  const mockRoomsStore = newMockRoomsStore();
  const processor = commandProcessorFactory(
    commandHandlers,
    baseCommandSchema,
    eventHandlers,
    mockRoomsStore
  );
  return {mockRoomsStore, processor};
}

const removeSampleStoryFromRoom = (mockRoomsStore) =>
  mockRoomsStore.manipulate((rm) => {
    rm.stories = [];
    rm.selectedStory = undefined;
    return rm;
  });

/**
 * create mock room store with one user in one room
 */
export async function prepOneUserInOneRoom(username = 'firstUser') {
  const {mockRoomsStore, processor} = prepEmpty();

  const roomId = uuid();
  const userId = uuid();
  await processor(
    {
      id: uuid(),
      roomId,
      name: 'joinRoom',
      payload: {
        username
      }
    },
    userId
  );

  removeSampleStoryFromRoom(mockRoomsStore);

  return {userId, roomId, processor, mockRoomsStore};
}

export async function prepOneUserInOneRoomWithOneStory(username = 'firstUser') {
  const {userId, roomId, processor, mockRoomsStore} = await prepOneUserInOneRoom(username);

  const {producedEvents: adEvents} = await processor(
    {
      id: uuid(),
      roomId: roomId,
      name: 'addStory',
      payload: {
        title: 'the title',
        description: 'This will be awesome'
      }
    },
    userId
  );
  const storyId = adEvents[0].payload.storyId;

  return {userId, storyId, roomId, processor, mockRoomsStore};
}

export async function prepTwoUsersInOneRoomWithOneStoryAndEstimate(
  username,
  storyTitle,
  estimationValue = 8
) {
  const {userIdOne, userIdTwo, roomId, storyId, processor, mockRoomsStore} =
    await prepTwoUsersInOneRoomWithOneStory(username, storyTitle);

  await processor(
    {
      id: uuid(),
      roomId: roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId: storyId,
        value: estimationValue
      }
    },
    userIdOne
  );

  return {userIdOne, userIdTwo, roomId, storyId, processor, mockRoomsStore};
}

/**
 * create mock room store with two users in one room, a story already added (via cmd)
 */
export async function prepTwoUsersInOneRoomWithOneStory(
  username = 'firstUser',
  storyTitle = 'new super story'
) {
  const {mockRoomsStore, processor} = prepEmpty();

  const roomId = uuid();
  const userIdOne = uuid();
  const userIdTwo = uuid();
  await processor(
    {
      id: uuid(),
      roomId,
      name: 'joinRoom',
      payload: {
        username
      }
    },
    userIdOne
  );

  removeSampleStoryFromRoom(mockRoomsStore);

  await processor(
    {
      id: uuid(),
      roomId,
      name: 'joinRoom',
      payload: {
        username: 'secondUser'
      }
    },
    userIdTwo
  );

  const {producedEvents: addEvents} = await processor(
    {
      id: uuid(),
      roomId,
      name: 'addStory',
      payload: {
        title: storyTitle,
        description: 'This will be awesome'
      }
    },
    userIdOne
  );
  const storyId = addEvents[0].payload.storyId;

  return {userIdOne, userIdTwo, roomId, storyId, processor, mockRoomsStore};
}
