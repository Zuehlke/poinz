import initialState from '../../../../app/store/initialState.js';
import reduceMultipleEvents from './reduceMultipleEvents';
import loadEventsFromJson from './loadEventsFromJson';

let events;

beforeAll(async () => {
  events = await loadEventsFromJson('roomJoiningAndLeavingWithPasswordTest.json');
});

test('You create a room with password', () => {
  let modifiedState;

  const joinedEvent = events[1];
  const tokenIssuedEvent = events[2];

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: events[0].roomId,

      // needs to be set in initial state: client determines if a received "joinedRoom" event belongs "to us" (we are joining)
      pendingJoinCommandId: joinedEvent.correlationId
    },
    events
  );

  expect(modifiedState.roomId).toEqual(events[0].roomId);
  expect(modifiedState.passwordProtected).toBe(true);
  expect(modifiedState.userToken).toBe(tokenIssuedEvent.payload.token);
});
