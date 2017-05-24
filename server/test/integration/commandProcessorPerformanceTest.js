import {v4 as uuid} from 'uuid';
import roomStoreFactory from '../../src/store/roomStoreFactory';
import processorFactory from '../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers from '../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../src/eventHandlers/eventHandlers';

/**
 * tests the command processor performance with the real room store (redis)  but without socker connection (no json serializing, etc.)
 *
 */
describe('commandProcessor performance', () => {

  let userId;
  let roomId;
  let processor;

  beforeEach(() => {

    userId = uuid();
    roomId = 'rm_' + uuid();

    processor = processorFactory(commandHandlers, eventHandlers, roomStoreFactory(true));
  });

  it('1000 "addStory" commands/events', function () {

    const totalEvents = 1000;
    let eventCounter = 0;
    let commandCounter = 0;


    console.log(`--- Starting test with "addStory" on roomId ${roomId},  until ${totalEvents} events are received --`);
    console.time('commandProcessorPerformance');


    return processor({
      id: uuid(),
      roomId: roomId,
      name: 'joinRoom',
      payload: {}
    }, userId)
      .then(sendAddStoryCommand)
      .then(onHandled);

    function onHandled() {
      eventCounter++;
      if (eventCounter < totalEvents) {
        return sendAddStoryCommand().then(onHandled);
      }

      console.log(`Performance test done. sent ${commandCounter} commands. Received ${eventCounter} events.`);
      console.timeEnd('commandProcessorPerformance');
      console.log('\n---');
    }

    function sendAddStoryCommand() {
      commandCounter++;

      return processor({
        id: uuid(),
        roomId: roomId,
        name: 'addStory',
        payload: {
          title: `SuperStory_${commandCounter}`,
          description: 'This will be awesome'
        }
      }, userId);
    }

  });

});
