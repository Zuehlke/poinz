import reduceMultipleEvents from './reduceMultipleEvents';
import loadEventsFromJson from './loadEventsFromJson';
import getScenarioStartingState, {fakeJoinCommandSentState} from './getScenarioStartingState';
import {
  getOwnUser,
  getOwnUserId,
  getUserCount,
  getUsersById
} from '../../../src/state/users/usersSelectors';
import {getStoriesById} from '../../../src/state/stories/storiesSelectors';

let scenario;

beforeAll(async () => {
  scenario = await loadEventsFromJson('youGetKicked.json');
});

beforeEach(() => {
  scenario.reset();
});

test('Two users in a room, the other kicks you, you rejoin', () => {
  let modifiedState;

  const joinedEvtOne = scenario.events[1]; // you
  const secondJoinedEvt = scenario.events[10]; // you again

  modifiedState = reduceMultipleEvents(
    getScenarioStartingState(joinedEvtOne.correlationId),
    scenario.getNextEvents(9)
  );

  expect(getOwnUserId(modifiedState)).toBe(joinedEvtOne.userId);
  expect(getUserCount(modifiedState)).toBe(2);
  expect(Object.keys(getStoriesById(modifiedState)).length).toEqual(1);

  // let's reduce the "kicked" event (you got kicked)
  modifiedState = reduceMultipleEvents(modifiedState, scenario.getNextEvents(1));

  // you go kicked from the room, a lot of the local state is reset
  expect(getOwnUser(modifiedState)).toBeUndefined();
  expect(getUsersById(modifiedState)).toEqual({});
  expect(getOwnUserId(modifiedState)).toBeUndefined();
  expect(getStoriesById(modifiedState)).toEqual({});

  // let's reduce your second "joined" event
  modifiedState = fakeJoinCommandSentState(modifiedState, secondJoinedEvt.correlationId);
  modifiedState = reduceMultipleEvents(modifiedState, scenario.getNextEvents(1));

  expect(getOwnUserId(modifiedState)).toBe(joinedEvtOne.userId);
});
