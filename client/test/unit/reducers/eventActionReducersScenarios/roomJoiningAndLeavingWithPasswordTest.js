import initialState from '../../../../app/store/initialState.js';
import reduceMultipleEvents from './reduceMultipleEvents';
import loadEventsFromJson from './loadEventsFromJson';

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
    {
      ...initialState(),
      roomId: scenario.events[0].roomId,

      // needs to be set in initial state: client determines if a received "joinedRoom" event belongs "to us" (we are joining)
      pendingJoinCommandId: joinedEvent.correlationId
    },
    scenario.events
  );

  expect(modifiedState.roomId).toEqual(scenario.events[0].roomId);
  expect(modifiedState.passwordProtected).toBe(true);
  expect(modifiedState.userToken).toBe(tokenIssuedEvent.payload.token);
});
