const
  assert = require('assert'),
  Immutable = require('immutable'),
  uuid = require('node-uuid').v4,
  testUtils = require('../testUtils'),
  processorFactory = require('../../../src/commandProcessor'),
  handlerGatherer = require('../../../src/handlerGatherer');

describe('kick', () => {


  beforeEach(function () {
    const cmdHandlers = handlerGatherer.gatherCommandHandlers();
    const evtHandlers = handlerGatherer.gatherEventHandlers();

    this.userOneId = uuid();
    this.userTwoId = uuid();
    this.commandId = uuid();
    this.roomId = 'rm_' + uuid();

    this.mockRoomsStore = testUtils.newMockRoomsStore(Immutable.fromJS({
      id: this.roomId,
      stories: [],
      users: {
        [this.userOneId]: {
          id: this.userOneId
        },
        [this.userTwoId]: {
          id: this.userOneId,
          disconnected: true
        }
      }
    }));

    this.processor = processorFactory(cmdHandlers, evtHandlers, this.mockRoomsStore);

  });

  it('Should produce kicked event', function () {
    return this.processor({
        id: this.commandId,
        roomId: this.roomId,
        name: 'kick',
        payload: {
          userId: this.userTwoId
        }
      }, this.userOneId)
      .then(producedEvents => {
        assert(producedEvents);
        assert.equal(producedEvents.length, 1);

        const usernameSetEvent = producedEvents[0];
        testUtils.assertValidEvent(usernameSetEvent, this.commandId, this.roomId, this.userOneId, 'kicked');
        assert.equal(usernameSetEvent.payload.userId, this.userTwoId);
      });
  });

  it('Should remove user from room', function () {
    return this.processor({
        id: this.commandId,
        roomId: this.roomId,
        name: 'kick',
        payload: {
          userId: this.userTwoId
        }
      }, this.userOneId)
      .then(() => this.mockRoomsStore.getRoomById())
      .then(room => assert(!room.getIn(['users', this.userTwoId])));
  });

  describe('preconditions', () => {

    it('Should throw if userId does not match any user from the room', function () {
      return testUtils.assertPromiseRejects(
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'kick',
          payload: {
            userId: 'unknown'
          }
        }, this.userOneId),
        'Can only kick user that belongs to the same room!');
    });

    it('Should throw if tries to kick himself', function () {
      return testUtils.assertPromiseRejects(
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'kick',
          payload: {
            userId: this.userOneId
          }
        }, this.userOneId),
        'User cannot kick himself!');
    });
  });

});
