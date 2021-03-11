import reduceMultipleEvents from './reduceMultipleEvents';
import loadEventsFromJson from './loadEventsFromJson';
import getScenarioStartingState from './getScenarioStartingState';
import {getCardConfigInOrder} from '../../../app/state/room/roomSelectors';

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
    getScenarioStartingState(joinedEvtOne.correlationId),
    scenario.events
  );

  expect(getCardConfigInOrder(modifiedState)).toEqual(cardConfigSetEvent.payload.cardConfig);
});

test('autoReveal', () => {
  let modifiedState;

  const joinedEvtOne = scenario.events[1];

  modifiedState = reduceMultipleEvents(
    getScenarioStartingState(joinedEvtOne.correlationId),
    scenario.getNextEvents(7) // up until before first toggle
  );
  expect(modifiedState.room.autoReveal).toBe(true); // default is true

  modifiedState = reduceMultipleEvents(modifiedState, scenario.getSingleNextEvent()); // autoRevealOff
  expect(modifiedState.room.autoReveal).toBe(false);

  modifiedState = reduceMultipleEvents(modifiedState, scenario.getSingleNextEvent()); // autoRevealOn
  expect(modifiedState.room.autoReveal).toBe(true);
});
