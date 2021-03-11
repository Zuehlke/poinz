import reduceMultipleEvents from './reduceMultipleEvents';
import loadEventsFromJson from './loadEventsFromJson';
import getScenarioStartingState from './getScenarioStartingState';

let scenario;

beforeAll(async () => {
  scenario = await loadEventsFromJson('resetAndClearPasswordTest.json');
});

beforeEach(() => {
  scenario.reset();
});

test('Reset password and clear', () => {
  let modifiedState;

  const joinedEvtOne = scenario.events[1];

  modifiedState = reduceMultipleEvents(
    getScenarioStartingState(joinedEvtOne.correlationId),
    scenario.getNextEvents(8) // up until first "passwordSet"
  );

  expect(modifiedState.room.passwordProtected).toBe(true);

  modifiedState = reduceMultipleEvents(modifiedState, scenario.getSingleNextEvent()); // process "passwordCleared" event

  expect(modifiedState.room.passwordProtected).toBe(false);
});
