import {promises as fs} from 'fs';
import path from 'path';

import initialState from '../../../app/store/initialState.js';
import reduceMultipleEvents from './reduceMultipleEvents';

let events;

beforeAll(async () => {
  const eventRaw = await fs.readFile(
    path.resolve(__dirname, './disconnectAndKickTest.json'),
    'utf-8'
  );
  events = JSON.parse(eventRaw);
  console.log(
    `Loaded events for scenarios. ${events.length} in total. [${events
      .map((e, i) => i + '=>' + e.name)
      .join(', ')}]`
  );
});

test('Two users in a room, the other one disconnects, then you kick him', () => {
  let modifiedState;

  const joinedEvtOne = events[1];
  const joinedEvtTwo = events[4];
  const addedEvt = events[7];

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: events[0].roomId,
      pendingJoinCommandId: joinedEvtOne.correlationId
    },
    events.slice(0, 11) // up until "connectionLost"
  );

  // in contrast to "roomLeft",  on "connectionLost", user object stays. is marked as disconnected
  expect(modifiedState.users[joinedEvtTwo.userId]).toEqual({
    avatar: 0,
    excluded: false,
    username: 'John',
    disconnected: true, // <<-
    id: joinedEvtTwo.userId
  });

  // also the estimation of the disconnected user is still in state
  expect(modifiedState.estimations[addedEvt.payload.storyId]).toEqual({
    [joinedEvtTwo.userId]: 8
  });

  modifiedState = reduceMultipleEvents(modifiedState, [events[11]]);

  // now only our own user is left
  expect(modifiedState.users).toEqual({
    [joinedEvtOne.userId]: {
      avatar: 0,
      disconnected: false,
      username: 'Jim',
      id: joinedEvtOne.userId
    }
  });

  // estimation values are kept, even for kicked users
  expect(modifiedState.estimations[addedEvt.payload.storyId]).toEqual({
    [joinedEvtTwo.userId]: 8
  });
});
