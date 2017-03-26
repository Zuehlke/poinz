import assert from 'assert';
import Immutable from 'immutable';
import _ from 'lodash';
import eventReducer from '../../app/services/eventReducer';
import {EVENT_ACTION_TYPES} from '../../app/actions/types';

/**
 * Tests the event reducing functions for various events.
 *
 * Ensures that events modify the client app state as expected.
 *
 * // TODO: test every incoming event?
 **/
describe('eventReducer', () => {

  before(() => {
    global.localStorage = {setItem: _.noop, getItem: _.noop};
    global.document = {};
  });

  it(EVENT_ACTION_TYPES.roomCreated, () => {
    const startingState = new Immutable.Map({
      roomId: 'myRoom'
    });
    const modifiedState = eventReducer(startingState, {
      type: EVENT_ACTION_TYPES.roomCreated,
      event: {
        roomId: 'myRoom',
        payload: {}
      }
    });
    assert.deepEqual(modifiedState.get('roomId'), startingState.get('roomId'));
  });

  it(EVENT_ACTION_TYPES.storyAdded, () => {
    const startingState = Immutable.fromJS({
      roomId: 'someRoom',
      stories: {}
    });
    const modifiedState = eventReducer(startingState, {
      type: EVENT_ACTION_TYPES.storyAdded,
      event: {
        roomId: 'someRoom',
        payload: {
          id: 'story334',
          title: 'the new feature x',
          description: 'will be great!',
          estimations: {}
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

  it(EVENT_ACTION_TYPES.storyDeleted, () => {
    const startingState = Immutable.fromJS({
      roomId: 'someRoom',
      stories: {
        story01: {
          title: 'aaaa',
          description: '',
          id: 'e9eaee24-92c2-410a-a7b4-e9c796d68369',
          estimations: {},
          createdAt: 1485359114569
        },
        story02: {
          title: 'asdf',
          description: 'af',
          id: '3b8b38dd-1456-46d8-8174-2e981ad746f1',
          estimations: {},
          createdAt: 1485425539399
        }
      }
    });

    const modifiedState = eventReducer(startingState, {
      type: EVENT_ACTION_TYPES.storyDeleted,
      event: {
        roomId: 'someRoom',
        payload: {
          storyId: 'story01'
        }
      }
    });

    assert.deepEqual(modifiedState.get('stories').toJS(), {
      story02: {
        title: 'asdf',
        description: 'af',
        id: '3b8b38dd-1456-46d8-8174-2e981ad746f1',
        estimations: {},
        createdAt: 1485425539399
      }
    });
  });

  describe(EVENT_ACTION_TYPES.joinedRoom, () => {
    it('someone else joined', () => {

      const startingState = Immutable.fromJS({
        userId: 'myUserId',
        roomId: 'ourRoom',
        users: {
          myUserId: {
            username: 'tester1'
          }
        }
      });

      const modifiedState = eventReducer(startingState, {
        type: EVENT_ACTION_TYPES.joinedRoom,
        event: {
          roomId: 'ourRoom',
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
        roomId: 'myRoom',
        waitingForJoin: true
      });

      const modifiedState = eventReducer(startingState, {
        type: EVENT_ACTION_TYPES.joinedRoom,
        event: {
          roomId: 'myRoom',
          payload: {
            userId: 'myUserId',
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

      assert.equal(modifiedState.get('roomId'), 'myRoom');
      assert.equal(modifiedState.get('userId'), 'myUserId');
      assert.equal(modifiedState.get('selectedStory'), 'storyOne');
      assert.deepEqual(modifiedState.get('stories').toJS(), {
        storyOne: {}
      });
      assert.deepEqual(modifiedState.get('users').toJS(), {
        myUserId: {}
      });

    });

  });

  describe(EVENT_ACTION_TYPES.leftRoom, () => {
    it('someone else left', () => {

      const startingState = Immutable.fromJS({
        userId: 'myUser',
        roomId: 'myRoom',
        users: {
          myUser: {},
          someoneElse: {}
        },
        stories: {}
      });

      const modifiedState = eventReducer(startingState, {
        type: EVENT_ACTION_TYPES.leftRoom,
        event: {
          roomId: 'myRoom',
          payload: {
            userId: 'someoneElse'
          }
        }
      });

      assert.deepEqual(modifiedState.get('users').toJS(), {myUser: {}});
    });
  });


  describe(EVENT_ACTION_TYPES.kicked, () => {
    it('someone kicked a disconnected user from the room', () => {

      const startingState = Immutable.fromJS({
        userId: 'myUser',
        roomId: 'myRoom',
        users: {
          myUser: {},
          someoneElse: {}
        },
        stories: {}
      });

      const modifiedState = eventReducer(startingState, {
        type: EVENT_ACTION_TYPES.kicked,
        event: {
          roomId: 'myRoom',
          payload: {
            userId: 'someoneElse'
          }
        }
      });

      assert.deepEqual(modifiedState.get('users').toJS(), {myUser: {}});
    });
  });

});
