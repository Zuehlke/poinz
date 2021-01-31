import initialState from '../../../../app/store/initialState.js';
import reduceMultipleEvents from './reduceMultipleEvents';
import loadEventsFromJson from './loadEventsFromJson';

let events;

beforeAll(async () => {
  events = await loadEventsFromJson('resetAndClearPasswordTest.json');
});

test('Exclude and Include', () => {
  let modifiedState;

  const joinedEvtOne = events[1];

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: events[0].roomId,
      pendingJoinCommandId: joinedEvtOne.correlationId
    },
    events.slice(0, 6) // up until first "passwordSet"
  );

  expect(modifiedState.passwordProtected).toBe(true);

  modifiedState = reduceMultipleEvents(modifiedState, [events[6]]); // process "passwordCleared" event

  expect(modifiedState.passwordProtected).toBe(false);
});
