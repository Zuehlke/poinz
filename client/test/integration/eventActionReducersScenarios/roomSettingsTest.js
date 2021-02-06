import initialState from '../../../app/store/initialState.js';
import reduceMultipleEvents from './reduceMultipleEvents';
import loadEventsFromJson from './loadEventsFromJson';

let scenario;

beforeAll(async () => {
  scenario = await loadEventsFromJson('roomSettingsTest.json');
});

beforeEach(() => {
  scenario.reset();
});

test('cardConfig', () => {
  let modifiedState;

  const joinedEvtOne = scenario.events[1];
  const cardConfigSetEvent = scenario.events[6];

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: scenario.events[0].roomId,
      pendingJoinCommandId: joinedEvtOne.correlationId
    },
    scenario.events
  );

  expect(modifiedState.cardConfig).toEqual(cardConfigSetEvent.payload.cardConfig);
});

test('autoReveal', () => {
  let modifiedState;

  const joinedEvtOne = scenario.events[1];

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: scenario.events[0].roomId,
      pendingJoinCommandId: joinedEvtOne.correlationId
    },
    scenario.getNextEvents(7) // up until before first toggle
  );
  expect(modifiedState.autoReveal).toBe(true); // default is true

  modifiedState = reduceMultipleEvents(modifiedState, scenario.getSingleNextEvent()); // autoRevealOff
  expect(modifiedState.autoReveal).toBe(false);

  modifiedState = reduceMultipleEvents(modifiedState, scenario.getSingleNextEvent()); // autoRevealOn
  expect(modifiedState.autoReveal).toBe(true);
});
