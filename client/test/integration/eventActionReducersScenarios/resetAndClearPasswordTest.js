import initialState from '../../../app/store/initialState.js';
import reduceMultipleEvents from './reduceMultipleEvents';
import loadEventsFromJson from './loadEventsFromJson';

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
    {
      ...initialState(),
      roomId: scenario.events[0].roomId,
      pendingJoinCommandId: joinedEvtOne.correlationId
    },
    scenario.getNextEvents(8) // up until first "passwordSet"
  );

  expect(modifiedState.passwordProtected).toBe(true);

  modifiedState = reduceMultipleEvents(modifiedState, scenario.getSingleNextEvent()); // process "passwordCleared" event

  expect(modifiedState.passwordProtected).toBe(false);
});
