import {promises as fs} from 'fs';
import path from 'path';

import initialState from '../../../app/store/initialState';
import reduceMultipleEvents from './reduceMultipleEvents';

let events;

beforeAll(async () => {
  const eventRaw = await fs.readFile(path.resolve(__dirname, './estimatingTest.json'), 'utf-8');
  events = JSON.parse(eventRaw);
  console.log(
    `Loaded events for scenarios. ${events.length} in total. [${events
      .map((e, i) => i + '=>' + e.name)
      .join(', ')}]`
  );
});

test('Estimation with two users', () => {
  let modifiedState;

  const joinedEvtOne = events[1];
  const joinedEvtTwo = events[3];

  const addedEvtOne = events[7];
  const storyIdOne = addedEvtOne.payload.storyId;
  const addedEvtTwo = events[9];
  const storyIdTwo = addedEvtTwo.payload.storyId;

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: events[0].roomId,
      pendingJoinCommandId: joinedEvtOne.correlationId
    },
    events.slice(0, 11) // up until first story estimate given
  );

  expect(modifiedState.stories[storyIdOne]).toEqual({
    createdAt: addedEvtOne.payload.createdAt,
    description: 'This is a story',
    id: storyIdOne,
    title: 'ISSUE-SUPER-2'
  });
  expect(modifiedState.stories[storyIdTwo]).toEqual({
    createdAt: addedEvtTwo.payload.createdAt,
    description: 'This is a second story',
    id: storyIdTwo,
    title: 'ISSUE-SUPER-5'
  });

  expect(modifiedState.estimations).toEqual({
    [storyIdOne]: {
      [joinedEvtOne.userId]: 3
    }
  });

  modifiedState = reduceMultipleEvents(modifiedState, [events[11]]); //  storyEstimateCleared
  expect(modifiedState.estimations).toEqual({
    [storyIdOne]: {
      // no estimations for this story anymore
    }
  });

  modifiedState = reduceMultipleEvents(modifiedState, events.slice(12, 14)); // both did estimate
  expect(modifiedState.estimations).toEqual({
    [storyIdOne]: {
      [joinedEvtOne.userId]: 5,
      [joinedEvtTwo.userId]: 5
    }
  });

  modifiedState = reduceMultipleEvents(modifiedState, events.slice(14, 16)); // revealed and consensus
  expect(modifiedState.stories[storyIdOne].revealed).toBe(true);
  expect(modifiedState.stories[storyIdOne].consensus).toBe(5);
  expect(modifiedState.applause).toBe(true);

  modifiedState = reduceMultipleEvents(modifiedState, [events[16]]); // new round
  expect(modifiedState.stories[storyIdOne].revealed).toBe(false); // story no longer revealed
  expect(modifiedState.stories[storyIdOne].consensus).toBe(undefined);
  expect(modifiedState.estimations).toEqual({
    // old values for story removed
  });
  expect(modifiedState.applause).toBe(false);
});
