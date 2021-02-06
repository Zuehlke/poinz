import initialState from '../../../../app/store/initialState.js';
import clientSettingsStore from '../../../../app/store/clientSettingsStore';
import reduceMultipleEvents from './reduceMultipleEvents';
import loadEventsFromJson from './loadEventsFromJson';

let scenario;

beforeAll(async () => {
  scenario = await loadEventsFromJson('roomJoiningAndLeavingTest.json');
});

beforeEach(() => {
  scenario.reset();
});

test('You join an existing room', () => {
  let modifiedState;

  const otherUserJoinedEvent = scenario.events[2];
  const otherUserId = otherUserJoinedEvent.userId;

  const ourJoinEvent = scenario.events[9];
  const ourUserId = ourJoinEvent.userId;

  const storyAddedEvent = scenario.events[3];
  const storyId = storyAddedEvent.payload.storyId;

  scenario.getNextEvents(9); // "fast forward" to before second user (that's us!) joined

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: scenario.events[0].roomId,
      pendingJoinCommandId: ourJoinEvent.correlationId
    },
    scenario.getNextEvents(4)
  );

  expect(modifiedState.autoReveal).toBe(true);
  expect(modifiedState.roomId).toEqual(scenario.events[0].roomId);
  expect(modifiedState.passwordProtected).toBe(false);
  expect(modifiedState.userId).toEqual(ourUserId); // we got the userId from the server, correctly set to state
  expect(modifiedState.users).toEqual({
    // users is an object, indexed by userId
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

  // stories is an object indexed by storyId. stories no longer have the "estimations" property
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
  expect(clientSettingsStore.getPresetAvatar()).toEqual(scenario.events[10].payload.avatar);
  expect(clientSettingsStore.getPresetUsername()).toEqual(scenario.events[11].payload.username);
  expect(clientSettingsStore.getPresetEmail()).toEqual(scenario.events[12].payload.email);
});

test('You in a room, other user joins ', () => {
  let modifiedState;

  const ourJoinEvent = scenario.events[2];
  const ourUserId = ourJoinEvent.userId;

  const otherJoinEvent = scenario.events[9];
  const otherUserId = otherJoinEvent.userId;

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: scenario.events[0].roomId,
      pendingJoinCommandId: ourJoinEvent.correlationId
    },
    scenario.getNextEvents(13)
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
  const otherJoinEvent = scenario.events[1];
  const otherUserId = otherJoinEvent.userId;

  const ourJoinEvent = scenario.events[9];
  const ourUserId = ourJoinEvent.userId;

  const storyAddedEvent = scenario.events[3];
  const storyId = storyAddedEvent.payload.storyId;

  scenario.getNextEvents(9); // "fast forward" to before second user (that's us!) joined

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: scenario.events[0].roomId,
      pendingJoinCommandId: ourJoinEvent.correlationId
    },
    scenario.getNextEvents(4)
  );

  expect(modifiedState.roomId).toEqual(scenario.events[0].roomId);
  expect(modifiedState.userId).toEqual(ourUserId); // we got the userId from the server, correctly set to state
  expect(Object.values(modifiedState.users).length).toBe(2);

  modifiedState = reduceMultipleEvents(modifiedState, scenario.getSingleNextEvent()); // leftRoom event
  expect(modifiedState.roomId).toEqual(scenario.events[0].roomId);
  expect(modifiedState.userId).toEqual(ourUserId);
  expect(Object.values(modifiedState.users).length).toBe(1); // only one user left
  expect(Object.values(modifiedState.users)[0].id).toBe(ourUserId);

  expect(modifiedState.stories).toEqual({
    [storyId]: {
      title: storyAddedEvent.payload.title,
      description: storyAddedEvent.payload.description,
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

  const ourJoinEvent = scenario.events[2];

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: scenario.events[0].roomId,
      pendingJoinCommandId: ourJoinEvent.correlationId
    },
    scenario.getNextEvents(13)
  );
  expect(Object.values(modifiedState.users).length).toBe(2);

  modifiedState = reduceMultipleEvents(modifiedState, scenario.getSingleNextEvent());

  // When own user leaves, state is reset. except, actionLog has one new entry (log is added after event reduced).
  expect(modifiedState.actionLog.length).toBe(1);
  // so we set it to an empty array manually here
  modifiedState.actionLog = [];
  expect(modifiedState).toEqual(initialState());
});
