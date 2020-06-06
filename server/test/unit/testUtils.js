import {v4 as uuid} from 'uuid';
import Promise from 'bluebird';
import Immutable from 'immutable';

// we want to test with our real command- and event handlers.
import commandHandlers from '../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../src/eventHandlers/eventHandlers';

import {commandProcessorFactory} from './commandAndEventDocuGenerator';

export const EXPECT_UUID_MATCHING = expect.stringMatching(
  new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
);

/**
 * our mock roomsStore contains only one room.
 * commandProcessor will load this room (if set), and store back manipulated room.
 *
 * room object can be manually manipulated to prepare for different scenarios.
 *
 * @param {Immutable.Map | object} [initialRoom] If not set, room will not exists in store.
 */
export function newMockRoomsStore(initialRoom) {
  let room = initialRoom
    ? initialRoom.toJS
      ? initialRoom
      : Immutable.fromJS(initialRoom)
    : undefined;

  return {
    getRoomById: (id) => {
      if (!room || room.get('id') !== id) {
        return Promise.resolve(undefined);
      }
      return Promise.resolve(room);
    },
    getRoomByAlias: (alias) => {
      if (!room || room.get('alias') !== alias) {
        return Promise.resolve(undefined);
      }
      return Promise.resolve(room);
    },
    saveRoom: (rm) => {
      room = rm;
      return Promise.resolve();
    },
    manipulate: (fn) => (room = fn(room))
  };
}

export function prepEmpty() {
  const mockRoomsStore = newMockRoomsStore();
  const processor = commandProcessorFactory(commandHandlers, eventHandlers, mockRoomsStore);
  return {mockRoomsStore, processor};
}

/**
 * create mock room store with one user in one room
 */
export async function prepOneUserInOneRoom(username = 'firstUser') {
  const userId = uuid();

  const {mockRoomsStore, processor} = prepEmpty();

  const {producedEvents: crEvents} = await processor(
    {
      id: uuid(),
      name: 'createRoom',
      payload: {
        userId,
        username
      }
    },
    userId
  );

  const roomId = crEvents[1].roomId;

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
  const storyId = adEvents[0].payload.id;

  return {userId, storyId, roomId, processor, mockRoomsStore};
}

export async function prepTwoUsersInOneRoomWithOneStoryAndEstimate(
  username,
  storyTitle,
  estimationValue = 8
) {
  const {
    userIdOne,
    userIdTwo,
    roomId,
    storyId,
    processor,
    mockRoomsStore
  } = await prepTwoUsersInOneRoomWithOneStory(username, storyTitle);

  await processor(
    {
      id: uuid(),
      roomId: roomId,
      name: 'giveStoryEstimate',
      payload: {
        userId: userIdOne,
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
  const userIdOne = uuid();
  const userIdTwo = uuid();

  const {mockRoomsStore, processor} = prepEmpty();

  const {producedEvents: crEvents} = await processor(
    {
      id: uuid(),
      name: 'createRoom',
      payload: {
        userId: userIdOne,
        username
      }
    },
    userIdOne
  );
  const roomId = crEvents[1].roomId;

  await processor(
    {
      id: uuid(),
      roomId,
      name: 'joinRoom',
      payload: {
        userId: userIdTwo,
        username: 'secondUser'
      }
    },
    userIdTwo
  );

  const {producedEvents: adEvents} = await processor(
    {
      id: uuid(),
      roomId: roomId,
      name: 'addStory',
      payload: {
        title: storyTitle,
        description: 'This will be awesome'
      }
    },
    userIdOne
  );
  const storyId = adEvents[0].payload.id;

  return {userIdOne, userIdTwo, roomId, storyId, processor, mockRoomsStore};
}
