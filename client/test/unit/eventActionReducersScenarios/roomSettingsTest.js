import {promises as fs} from 'fs';
import path from 'path';

import initialState from '../../../app/store/initialState.js';
import reduceMultipleEvents from './reduceMultipleEvents';

let events;

beforeAll(async () => {
  const eventRaw = await fs.readFile(path.resolve(__dirname, './roomSettingsTest.json'), 'utf-8');
  events = JSON.parse(eventRaw);
  console.log(
    `Loaded events for scenarios. ${events.length} in total. [${events
      .map((e, i) => i + '=>' + e.name)
      .join(', ')}]`
  );
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
