import reduceMultipleEvents from './reduceMultipleEvents';
import loadEventsFromJson from './loadEventsFromJson';
import getScenarioStartingState from './getScenarioStartingState';

let scenario;

beforeAll(async () => {
  scenario = await loadEventsFromJson('roomJoiningAndLeavingWithPasswordTest.json');
});

beforeEach(() => {
  scenario.reset();
});

test('You create a room on the fly, then set password & you re-join with that password', () => {
  let modifiedState;

  const secondJoinedEvent = scenario.events[9];
  const tokenIssuedEvent = scenario.events[10];

  modifiedState = reduceMultipleEvents(
    getScenarioStartingState(secondJoinedEvent.correlationId),
    scenario.events
  );

  expect(modifiedState.room.roomId).toEqual(scenario.events[0].roomId);
  expect(modifiedState.room.passwordProtected).toBe(true);
  expect(modifiedState.users.ownUserToken).toBe(tokenIssuedEvent.payload.token);
});
