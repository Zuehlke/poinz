import {promises as fs} from 'fs';
import path from 'path';

import initialState from '../../../app/store/initialState.js';
import clientSettingsStore from '../../../app/store/clientSettingsStore';
import reduceMultipleEvents from './reduceMultipleEvents';

let events;

beforeAll(async () => {
  const eventRaw = await fs.readFile(
    path.resolve(__dirname, './roomJoiningAndLeavingTest.json'),
    'utf-8'
  );
  events = JSON.parse(eventRaw);
  console.log(
    `Loaded events for scenarios. ${events.length} in total. [${events
      .map((e, i) => i + '=>' + e.name)
      .join(', ')}]`
  );
});

test('You join an existing room', () => {
  let modifiedState;

  const otherJoinEvent = events[2];
  const otherUserId = otherJoinEvent.userId;

  const ourJoinEvent = events[9];
  const ourUserId = ourJoinEvent.userId;

  const storyAddedEvent = events[4];
  const storyId = storyAddedEvent.payload.storyId;

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: events[0].roomId,
      pendingJoinCommandId: ourJoinEvent.correlationId
    },
    events.slice(9, 13) // skip everything up until second user (that's us!) joined
  );

  expect(modifiedState.autoReveal).toBe(true);
  expect(modifiedState.roomId).toEqual(events[0].roomId);
  expect(modifiedState.userId).toEqual(ourUserId); // we got the userId from the server, correctly set to state
  expect(modifiedState.users).toEqual({
    [otherUserId]: {
      avatar: 0,
      disconnected: false,
      id: otherUserId,
      username: 'Jim'
    },
    [ourUserId]: {
      avatar: 0,
      disconnected: false,
      excluded: false,
      id: ourUserId,
      username: 'John',
      email: 'test.johnny@gmail.com',
      emailHash: 'f040d8bf881a96d34e193983b3df6087'
    }
  });

  // stories without the "estimations" properties
  expect(modifiedState.stories).toEqual({
    [storyId]: {
      id: storyId,
      title: storyAddedEvent.payload.title,
      createdAt: storyAddedEvent.payload.createdAt,
      description: storyAddedEvent.payload.description,
      consensus: 4,
      revealed: true
    }
  });

  // the estimations in a separate object on the state
  expect(modifiedState.estimations).toEqual({
    [storyId]: {
      [otherUserId]: 4
    }
  });

  expect(clientSettingsStore.getPresetUserId()).toEqual(ourUserId);
  expect(clientSettingsStore.getPresetAvatar()).toEqual(events[10].payload.avatar);
  expect(clientSettingsStore.getPresetUsername()).toEqual(events[11].payload.username);
  expect(clientSettingsStore.getPresetEmail()).toEqual(events[12].payload.email);
});

test('You in a room, other user joins ', () => {
  let modifiedState;

  const ourJoinEvent = events[2];
  const ourUserId = ourJoinEvent.userId;

  const otherJoinEvent = events[9];
  const otherUserId = otherJoinEvent.userId;

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: events[0].roomId,
      pendingJoinCommandId: ourJoinEvent.correlationId
    },
    events.slice(0, 13)
  );

  expect(modifiedState.roomId).toEqual(ourJoinEvent.roomId);
  expect(modifiedState.userId).toEqual(ourUserId);

  expect(modifiedState.users).toEqual({
    [otherUserId]: {
      avatar: 0,
      disconnected: false,
      email: 'test.johnny@gmail.com',
      emailHash: 'f040d8bf881a96d34e193983b3df6087',
      excluded: false,
      id: otherUserId,
      username: 'John'
    },
    [ourUserId]: {
      avatar: 0,
      disconnected: false,
      id: ourUserId,
      username: 'Jim'
    }
  });

  expect(clientSettingsStore.getPresetUserId()).toEqual(ourUserId);
});

test('You join an existing room, the other leaves', () => {
  let modifiedState;

  const otherJoinEvent = events[1];
  const otherUserId = otherJoinEvent.userId;

  const ourJoinEvent = events[9];
  const ourUserId = ourJoinEvent.userId;

  const storyAddedEvent = events[4];
  const storyId = storyAddedEvent.payload.storyId;

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: events[0].roomId,
      pendingJoinCommandId: ourJoinEvent.correlationId
    },
    events.slice(9, 13) // skip everything up until second user (that's us!) joined
  );

  expect(modifiedState.roomId).toEqual(events[0].roomId);
  expect(modifiedState.userId).toEqual(ourUserId); // we got the userId from the server, correctly set to state
  expect(Object.values(modifiedState.users).length).toBe(2);

  modifiedState = reduceMultipleEvents(modifiedState, [events[13]]); // leftRoom event
  expect(modifiedState.roomId).toEqual(events[0].roomId);
  expect(modifiedState.userId).toEqual(ourUserId);
  expect(Object.values(modifiedState.users).length).toBe(1); // only one user left
  expect(Object.values(modifiedState.users)[0].id).toBe(ourUserId);

  expect(modifiedState.stories).toEqual({
    [storyId]: {
      title: storyAddedEvent.payload.title,
      id: storyId,
      consensus: 4,
      revealed: true,
      createdAt: storyAddedEvent.payload.createdAt
    }
  });

  expect(modifiedState.estimations).toEqual({
    [storyId]: {
      [otherUserId]: 4 // we keep estimations of users.  mainly because we want to still have these values when exporting the room (to json file)
    }
  });
});

test('You in a room, other user joins, you leave', () => {
  let modifiedState;

  const ourJoinEvent = events[2];

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: events[0].roomId,
      pendingJoinCommandId: ourJoinEvent.correlationId
    },
    events.slice(0, 13)
  );
  expect(Object.values(modifiedState.users).length).toBe(2);

  modifiedState = reduceMultipleEvents(modifiedState, [events[13]]);

  // When own user leaves, state is reset. except, actionLog has one new entry (log is added after event reduced).
  expect(modifiedState.actionLog.length).toBe(1);
  // so we set it to an empty array manually here
  modifiedState.actionLog = [];
  expect(modifiedState).toEqual(initialState());
});
