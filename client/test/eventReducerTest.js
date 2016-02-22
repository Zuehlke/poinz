import assert from 'assert';
import Immutable from 'immutable';
import _ from 'lodash';
import eventReducer from '../app/services/eventReducer';
import * as types from '../app/services/actionTypes';
import * as actions from '../app/services/actions';

/**
 * Tests the event reducing functions for various events.
 *
 * Ensures that events modify the client app state as expected.
 *
 * // TODO: test every incoming event
 **/
describe('eventReducer', () => {

  before(() => {
    global.localStorage = {setItem: _.noop, getItem: _.noop};
  });

  it(types.ROOM_CREATED, () => {
    const startingState = new Immutable.Map();
    const modifiedState = eventReducer(startingState, {
      type: types.ROOM_CREATED,
      event: {
        payload: {}
      }
    });
    assert.deepEqual(modifiedState.toJS(), startingState.toJS());
  });

  it(types.MODERATOR_SET, () => {
    const startingState = new Immutable.Map();
    const modifiedState = eventReducer(startingState, {
      type: types.MODERATOR_SET,
      event: {
        payload: {
          moderatorId: 'some-moderator-user-id'
        }
      }
    });
    assert.equal(modifiedState.get('moderatorId'), 'some-moderator-user-id');
  });

  it(types.STORY_ADDED, () => {
    const startingState = Immutable.fromJS({
      stories: {}
    });
    const modifiedState = eventReducer(startingState, {
      type: types.STORY_ADDED,
      event: {
        payload: {
          id: 'story334',
          title: 'the new feature x',
          description: 'will be great!'
        }
      }
    });
    assert.deepEqual(modifiedState.get('stories').toJS(), {
      story334: {
        description: 'will be great!',
        estimations: {},
        id: 'story334',
        title: 'the new feature x'
      }
    });
  });

  describe(types.JOINED_ROOM, () => {
    it('someone else joined', () => {

      const startingState = Immutable.fromJS({
        userId: 'myUserId',
        users: {
          myUserId: {
            username: 'tester1'
          }
        }
      });

      const modifiedState = eventReducer(startingState, {
        type: types.JOINED_ROOM,
        event: {
          payload: {
            userId: 'theNewUser',
            users: {
              myUserId: {},
              theNewUser: {}
            }
          }
        }
      });

      assert.deepEqual(modifiedState.get('users').toJS(), {
        myUserId: {username: 'tester1'}, theNewUser: {}
      }, 'The new user must be added to the room.users object. Nothing else must be changed.');
    });

    it('you joined', () => {

      const startingState = Immutable.fromJS({
        // state has no userId set
      });

      const modifiedState = eventReducer(startingState, {
        type: types.JOINED_ROOM,
        event: {
          roomId: 'myRoom',
          payload: {
            userId: 'myUserId',
            moderatorId: 'someModeratorId',
            selectedStory: 'storyOne',
            stories: {
              storyOne: {}
            },
            users: {
              myUserId: {}
            }
          }
        }
      });

      assert.deepEqual(modifiedState.toJS(), {
        roomId: 'myRoom',
        userId: 'myUserId',
        moderatorId: 'someModeratorId',
        selectedStory: 'storyOne',
        stories: {
          storyOne: {}
        },
        users: {
          myUserId: {}
        },
        waitingForJoin: false
      }, '');
    });
  });


});
