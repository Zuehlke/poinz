import {promises as fs} from 'fs';
import path from 'path';

import initialState from '../../../app/store/initialState.js';
import reduceMultipleEvents from './reduceMultipleEvents';

let events;

beforeAll(async () => {
  const eventRaw = await fs.readFile(
    path.resolve(__dirname, './resetAndClearPasswordTest.json'),
    'utf-8'
  );
  events = JSON.parse(eventRaw);
  console.log(
    `Loaded events for scenarios. ${events.length} in total. [${events
      .map((e, i) => i + '=>' + e.name)
      .join(', ')}]`
  );
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
