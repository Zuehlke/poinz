import initialState from '../../../app/state/initialState.js';
import * as clientSettingsStore from '../../../app/state/clientSettingsStore';
import reduceMultipleEvents from './reduceMultipleEvents';
import loadEventsFromJson from './loadEventsFromJson';
import {
  getOwnUserId,
  getSortedUserArray,
  getUserCount,
  getUsersById
} from '../../../app/state/users/usersSelectors';
import {getStoriesById} from '../../../app/state/stories/storiesSelectors';
import {getEstimations} from '../../../app/state/estimations/estimationsSelectors';
import {getActionLog} from '../../../app/state/actionLog/actionLogSelectors';
import getScenarioStartingState from './getScenarioStartingState';

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
    getScenarioStartingState(ourJoinEvent.correlationId),
    scenario.getNextEvents(4)
  );

  expect(modifiedState.room.autoReveal).toBe(true);
  expect(modifiedState.room.withConfidence).toBe(false);
  expect(modifiedState.room.roomId).toEqual(scenario.events[0].roomId);
  expect(modifiedState.room.passwordProtected).toBe(false);
  expect(getOwnUserId(modifiedState)).toEqual(ourUserId); // we got the userId from the server, correctly set to state
  expect(getUsersById(modifiedState)).toEqual({
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
  expect(getStoriesById(modifiedState)).toEqual({
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
  expect(getEstimations(modifiedState)).toEqual({
    [storyId]: {
      [otherUserId]: {value: 4, confidence: 1}
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
    getScenarioStartingState(ourJoinEvent.correlationId),
    scenario.getNextEvents(13)
  );

  expect(modifiedState.room.roomId).toEqual(ourJoinEvent.roomId);
  expect(getOwnUserId(modifiedState)).toEqual(ourUserId);

  expect(getUsersById(modifiedState)).toEqual({
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
    getScenarioStartingState(ourJoinEvent.correlationId),
    scenario.getNextEvents(4)
  );

  expect(modifiedState.room.roomId).toEqual(scenario.events[0].roomId);
  expect(getOwnUserId(modifiedState)).toEqual(ourUserId); // we got the userId from the server, correctly set to state
  expect(getUserCount(modifiedState)).toBe(2);

  modifiedState = reduceMultipleEvents(modifiedState, scenario.getSingleNextEvent()); // leftRoom event
  expect(modifiedState.room.roomId).toEqual(scenario.events[0].roomId);
  expect(getOwnUserId(modifiedState)).toEqual(ourUserId);
  expect(getUserCount(modifiedState)).toBe(1); // only one user left
  expect(getSortedUserArray(modifiedState)[0].id).toBe(ourUserId);

  expect(getStoriesById(modifiedState)).toEqual({
    [storyId]: {
      title: storyAddedEvent.payload.title,
      description: storyAddedEvent.payload.description,
      id: storyId,
      consensus: 4,
      revealed: true,
      createdAt: storyAddedEvent.payload.createdAt
    }
  });

  expect(getEstimations(modifiedState)).toEqual({
    [storyId]: {
      // we keep estimations of users.  mainly because we want to still have these values when exporting the room (to json file)
      [otherUserId]: {value: 4, confidence: 1}
    }
  });
});

test('You in a room, other user joins, you leave', () => {
  let modifiedState;

  const ourJoinEvent = scenario.events[2];

  modifiedState = reduceMultipleEvents(
    getScenarioStartingState(ourJoinEvent.correlationId),
    scenario.getNextEvents(13)
  );
  expect(getUserCount(modifiedState)).toBe(2);

  modifiedState = reduceMultipleEvents(modifiedState, scenario.getSingleNextEvent());

  // When own user leaves , action log is reset and just one "you left" line is added
  expect(getActionLog(modifiedState).length).toBe(1);
  // so we set it to an empty array manually here
  modifiedState.actionLog = [];
  expect(modifiedState).toEqual({...initialState()});
});
