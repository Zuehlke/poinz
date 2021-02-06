import {v4 as uuid} from 'uuid';
import socketIoClient from 'socket.io-client';

/**
 * NOTE: for these performance tests, the PoinZ server must be running
 * at localhost:3000
 *
 */
describe('serverPerformance', () => {
  const backendUrl = 'http://localhost:3000';

  let socket, userId;

  afterEach(() => {
    if (socket) {
      socket.close();
    }
  });

  /*
   * Called for every test.
   */
  function prepSocketAndJoinNewRoom(done) {
    socket = socketIoClient(backendUrl);
    userId = uuid();
    let eventCount = 0;

    socket.on('event', (event) => {
      eventCount++;
      if (eventCount === 1) {
        expect(event.name).toBe('roomCreated');
      }
      if (eventCount === 2) {
        expect(event.name).toBe('joinedRoom');
        done(null, event.roomId);
      }
    });

    // let's join a room
    socket.on('connect', () =>
      socket.emit('command', {
        id: uuid(),
        roomId: uuid(),
        name: 'joinRoom',
        userId,
        payload: {}
      })
    );
  }

  test('should handle 100 "addStory" commands', (done) => {
    prepSocketAndJoinNewRoom((err, roomId) => {
      sendCommandsInSequence(
        socket,
        roomId,
        100,
        'addStory',
        {
          title: 'newStory'
        },
        done
      );
    });
  });

  test('should handle 1000 "addStory" commands', (done) => {
    prepSocketAndJoinNewRoom((err, roomId) => {
      sendCommandsInSequence(
        socket,
        roomId,
        1000,
        'addStory',
        {
          title: 'newStory-123',
          description: 'My super story'
        },
        done
      );
    });
  }, 50000);

  test('should handle 4000 "setUsername" commands', (done) => {
    prepSocketAndJoinNewRoom((err, roomId) => {
      sendCommandsInSequence(
        socket,
        roomId,
        4000,
        'setUsername',
        {
          username: 'jimmy'
        },
        done
      );
    });
  }, 50000);

  /**
   * sends multiple commands to the given socket in sequence.
   * will send commands as long as given "eventTotal" is not reached.
   * invokes done callback as soon as "eventTotal" events are received.
   *
   * @param socket
   * @param roomId
   * @param eventTotal
   * @param commandName
   * @param commandPayload
   * @param done
   */
  function sendCommandsInSequence(socket, roomId, eventTotal, commandName, commandPayload, done) {
    const testRunUniqueId = 'serverPerformanceTest_' + uuid();

    console.log(
      `--- Starting ${testRunUniqueId} with "${commandName}",  until ${eventTotal} events are received --`
    );

    let isDone = false;
    let eventCount = 0;
    let commandCount = 0;

    console.time(testRunUniqueId);
    send();

    socket.on('event', (ev) => {
      if (ev.name === 'commandRejected') {
        console.log(`eventCount so far ${eventCount}`);
        console.log(ev.payload.reason);
        throw new Error('A command was rejected!');
      }

      eventCount++;

      if (isDone) {
        // make sure to only call "done" and "console.timeEnd" once per testrun
        return;
      }

      if (eventCount < eventTotal) {
        send();
      } else {
        isDone = true;
        console.log(
          `Performance test done. Sent ${commandCount} commands. Received ${eventCount} events.`
        );
        console.timeEnd(testRunUniqueId);
        console.log('\n---');

        done();
      }
    });

    function send() {
      commandCount++;
      socket.emit('command', {
        id: uuid(),
        roomId,
        userId,
        name: commandName,
        payload: commandPayload
      });
    }
  }
});
