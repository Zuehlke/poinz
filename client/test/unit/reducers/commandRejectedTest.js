import uuid from '../../../app/services/uuid';
import {EVENT_ACTION_TYPES} from '../../../app/state/actions/eventActions';
import rootReducer from '../../../app/state/rootReducer';
import initialState from '../../../app/state/initialState';
import {roomInitialState} from '../../../app/state/room/roomReducer';
import {getActionLog} from '../../../app/state/actionLog/actionLogSelectors';
import {EXPECT_UUID_MATCHING} from '../../testUtils';

test(EVENT_ACTION_TYPES.commandRejected + ' should correctly be reduced to state ', () => {
  const roomId = uuid();
  const startingState = {...initialState(), room: {...roomInitialState, roomId: roomId}};

  const action = {
    type: EVENT_ACTION_TYPES.commandRejected,
    event: {
      name: 'commandRejected',
      id: '263a5420-f09c-46b9-a1d7-60544090e2c7',
      correlationId: '8b56882f-c014-4cbe-bdb2-644b485c5124',
      roomId: roomId,
      payload: {
        command: {
          name: 'giveStoryEstimate',
          payload: {
            storyId: 'dc3c0809-2c6e-42fd-93d2-3ee538113f12'
          },
          id: '8b56882f-c014-4cbe-bdb2-644b485c5124',
          userId: '3a7baa33-b516-40e0-b499-e3f85d023edd',
          roomId: 'sergio'
        },
        reason:
          'Command validation Error during "giveStoryEstimate": Missing required property: value in /payload'
      }
    }
  };

  const modifiedState = rootReducer(startingState, action);

  expect(getActionLog(modifiedState).length).toBe(1);
  expect(getActionLog(modifiedState)[0]).toMatchObject({
    isError: true,
    logId: EXPECT_UUID_MATCHING,
    message: expect.stringMatching('Command "giveStoryEstimate" was not successful')
  });

  expect(modifiedState.ui.unseenError).toBe(true);
});
