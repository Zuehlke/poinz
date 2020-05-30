import eventReducer from '../../app/services/eventReducer';
import {EVENT_ACTION_TYPES} from '../../app/actions/types';
import initialState from '../../app/store/initialState';

/**
 * Tests the event reducing functions for various events.
 *
 * Ensures that events modify the client app state as expected.
 *
 * // TODO: test every incoming event?
 **/
test(EVENT_ACTION_TYPES.roomCreated, () => {
  const startingState = {
    roomId: 'myRoom',
    actionLog: []
  };
  const modifiedState = eventReducer(startingState, {
    type: EVENT_ACTION_TYPES.roomCreated,
    event: {
      roomId: 'myRoom',
      payload: {}
    }
  });
  expect(modifiedState.roomId).toEqual(startingState.roomId);
});

test(EVENT_ACTION_TYPES.storyAdded, () => {
  const startingState = {
    roomId: 'someRoom',
    stories: {},
    actionLog: []
  };
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
  expect(modifiedState.stories).toEqual({
    story334: {
      description: 'will be great!',
      estimations: {},
      id: 'story334',
      title: 'the new feature x'
    }
  });
});

test(EVENT_ACTION_TYPES.storyDeleted, () => {
  const startingState = {
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
  };

  const modifiedState = eventReducer(startingState, {
    type: EVENT_ACTION_TYPES.storyDeleted,
    event: {
      roomId: 'someRoom',
      payload: {
        storyId: 'story01'
      }
    }
  });

  expect(modifiedState.stories).toEqual({
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
  test('someone else joined', () => {
    const startingState = {
      userId: 'myUserId',
      roomId: 'ourRoom',
      users: {
        myUserId: {
          username: 'tester1'
        }
      }
    };

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

    expect(modifiedState.users).toEqual(
      {
        myUserId: {username: 'tester1'},
        theNewUser: {}
      },
      'The new user must be added to the room.users object. Nothing else must be changed.'
    );
  });

  test('you joined', () => {
    const startingState = {
      roomId: 'myRoom',
      waitingForJoin: true
    };

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

    expect(modifiedState.roomId).toEqual('myRoom');
    expect(modifiedState.userId).toEqual('myUserId');
    expect(modifiedState.selectedStory).toEqual('storyOne');
    expect(modifiedState.stories).toEqual({
      storyOne: {}
    });
    expect(modifiedState.users).toEqual({
      myUserId: {}
    });
  });
});

describe(EVENT_ACTION_TYPES.leftRoom, () => {
  test('someone else left', () => {
    const startingState = {
      userId: 'myUser',
      roomId: 'myRoom',
      users: {
        myUser: {username: 'My User'},
        someoneElse: {username: 'Someone Else'} // <<-- this user will leave
      },
      stories: {
        someStoryId: {
          title: 'testTitle',
          description: 'testDescr',
          id: 'someStoryId',
          estimations: {
            someoneElse: 1 // <<--  the other user has an estimation
          },
          createdAt: 1579874949137,
          revealed: true
        }
      }
    };

    const modifiedState = eventReducer(startingState, {
      type: EVENT_ACTION_TYPES.leftRoom,
      event: {
        roomId: 'myRoom',
        payload: {
          userId: 'someoneElse'
        }
      }
    });

    expect(modifiedState.users).toEqual({myUser: {username: 'My User'}});
    expect(modifiedState.stories.someStoryId.estimations).toEqual({}); // <<- estimation of leaving user must be removed
  });

  test('you left', () => {
    const startingState = {
      userId: 'myUser',
      roomId: 'myRoom',
      users: {
        myUser: {username: 'My User'},
        someoneElse: {username: 'Someone Else'}
      },
      stories: {}
    };

    const modifiedState = eventReducer(startingState, {
      type: EVENT_ACTION_TYPES.leftRoom,
      event: {
        roomId: 'myRoom',
        payload: {
          userId: 'myUser'
        }
      }
    });

    // manually remove action log.  will have additional items in it, which is expected
    modifiedState.actionLog = [];
    expect(modifiedState).toEqual(initialState);
  });
});

describe(EVENT_ACTION_TYPES.kicked, () => {
  test('someone kicked a disconnected user from the room', () => {
    const startingState = {
      userId: 'myUser',
      roomId: 'myRoom',
      users: {
        myUser: {},
        someoneElse: {}
      },
      stories: {}
    };

    const modifiedState = eventReducer(startingState, {
      type: EVENT_ACTION_TYPES.kicked,
      event: {
        roomId: 'myRoom',
        payload: {
          userId: 'someoneElse'
        }
      }
    });

    expect(modifiedState.users).toEqual({myUser: {}});
  });
});
