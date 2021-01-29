import initialState from '../../../app/store/initialState.js';
import reduceMultipleEvents from './reduceMultipleEvents';
import loadEventsFromJson from './loadEventsFromJson';

let events;

beforeAll(async () => {
  events = await loadEventsFromJson('roomSettingsTest.json');
});

test('cardConfig', () => {
  let modifiedState;

  const joinedEvtOne = events[1];
  const cardConfigSetEvent = events[4];

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: events[0].roomId,
      pendingJoinCommandId: joinedEvtOne.correlationId
    },
    events
  );

  expect(modifiedState.cardConfig).toEqual(cardConfigSetEvent.payload.cardConfig);
});

test('autoReveal', () => {
  let modifiedState;

  const joinedEvtOne = events[1];

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: events[0].roomId,
      pendingJoinCommandId: joinedEvtOne.correlationId
    },
    events.slice(0, 5)
  );
  expect(modifiedState.autoReveal).toBe(true);

  modifiedState = reduceMultipleEvents(modifiedState, [events[5]]);
  expect(modifiedState.autoReveal).toBe(false);

  modifiedState = reduceMultipleEvents(modifiedState, [events[6]]);
  expect(modifiedState.autoReveal).toBe(true);
});
