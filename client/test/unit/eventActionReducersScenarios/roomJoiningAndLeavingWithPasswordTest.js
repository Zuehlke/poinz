import {promises as fs} from 'fs';
import path from 'path';

import initialState from '../../../app/store/initialState.js';
import reduceMultipleEvents from './reduceMultipleEvents';

let events;

beforeAll(async () => {
  const eventRaw = await fs.readFile(
    path.resolve(__dirname, './roomJoiningAndLeavingWithPasswordTest.json'),
    'utf-8'
  );
  events = JSON.parse(eventRaw);
  console.log(
    `Loaded events for scenarios. ${events.length} in total. [${events
      .map((e, i) => i + '=>' + e.name)
      .join(', ')}]`
  );
});

test('You create a room with password', () => {
  let modifiedState;

  const joinedEvent = events[1];

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: events[0].roomId,

      // needs to be set in initial state: client determines if a received "joinedRoom" event belongs "to us" (we are joining)
      pendingJoinCommandId: joinedEvent.correlationId
    },
    events.slice(0, 5)
  );

  expect(modifiedState.roomId).toEqual(events[0].roomId);
  expect(modifiedState.passwordProtected).toBe(true);
});
