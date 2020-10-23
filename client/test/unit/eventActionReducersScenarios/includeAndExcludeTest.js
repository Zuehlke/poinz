import {promises as fs} from 'fs';
import path from 'path';

import initialState from '../../../app/store/initialState.js';
import reduceMultipleEvents from './reduceMultipleEvents';

let events;

beforeAll(async () => {
  const eventRaw = await fs.readFile(
    path.resolve(__dirname, './includeAndExcludeTest.json'),
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
    events.slice(0, 8) // up until first "toggle" -> "excludedFromEstimations"
  );

  expect(modifiedState.users[joinedEvtOne.userId]).toEqual({
    avatar: 0,
    disconnected: false,
    excluded: true, // <<-- flag set
    id: joinedEvtOne.userId,
    username: 'Jim'
  });

  modifiedState = reduceMultipleEvents(modifiedState, [events[8]]);

  expect(modifiedState.users[joinedEvtOne.userId]).toEqual({
    avatar: 0,
    disconnected: false,
    excluded: false, // <<-- flag unset
    id: joinedEvtOne.userId,
    username: 'Jim'
  });
});
