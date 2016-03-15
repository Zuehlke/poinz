const
  assert = require('assert'),
  Immutable = require('immutable'),
  uuid = require('node-uuid').v4,
  testUtils = require('../testUtils'),
  processorFactory = require('../../src/commandProcessor'),
  handlerGatherer = require('../../src//handlerGatherer');

describe('setUsername', () => {


  beforeEach(function () {
    const cmdHandlers = handlerGatherer.gatherCommandHandlers();
    const evtHandlers = handlerGatherer.gatherEventHandlers();

    this.userId = uuid();
    this.commandId = uuid();
    this.roomId = 'rm_' + uuid();

    this.mockRoomsStore = testUtils.newMockRoomsStore(Immutable.fromJS({
      id: this.roomId,
      users: {
        [this.userId]: {
          id: this.userId
        }
      }
    }));

    this.processor = processorFactory(cmdHandlers, evtHandlers, this.mockRoomsStore);

  });

  it('Should produce usernameSet event', function () {
    return this.processor({
        id: this.commandId,
        roomId: this.roomId,
        name: 'setUsername',
        payload: {
          userId: this.userId,
          username: 'John Doe'
        }
      }, this.userId)
      .then(producedEvents => {
        assert(producedEvents);
        assert.equal(producedEvents.length, 1);

        const usernameSetEvent = producedEvents[0];
        testUtils.assertValidEvent(usernameSetEvent, this.commandId, this.roomId, this.userId, 'usernameSet');
        assert.equal(usernameSetEvent.payload.username, 'John Doe');
        assert.equal(usernameSetEvent.payload.userId, this.userId);
      });
  });

  it('Should store username', function () {
    return this.processor({
        id: this.commandId,
        roomId: this.roomId,
        name: 'setUsername',
        payload: {
          userId: this.userId,
          username: 'Mikey'
        }
      }, this.userId)
      .then(() => this.mockRoomsStore.getRoomById())
      .then(room => assert.equal(room.getIn(['users', this.userId, 'username']), 'Mikey'));
  });

  describe('preconditions', () => {

    it('Should throw if userId does not match', function () {
      return testUtils.assertPromiseRejects(
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'setUsername',
          payload: {
            userId: 'unknown',
            username: 'Mikey'
          }
        }, this.userId),
        'Can only set username for own user!');
    });
  });

});
