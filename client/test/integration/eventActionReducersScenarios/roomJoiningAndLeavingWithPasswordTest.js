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

test('You create a room with password', () => {
  let modifiedState;

  const joinedEvent = scenario.events[1];
  const tokenIssuedEvent = scenario.events[2];

  modifiedState = reduceMultipleEvents(
    getScenarioStartingState(joinedEvent.correlationId),
    scenario.events
  );

  expect(modifiedState.room.roomId).toEqual(scenario.events[0].roomId);
  expect(modifiedState.room.passwordProtected).toBe(true);
  expect(modifiedState.users.ownUserToken).toBe(tokenIssuedEvent.payload.token);
});
