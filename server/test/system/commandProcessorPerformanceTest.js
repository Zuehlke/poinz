import uuid from '../../src/uuid';
import roomStoreFactory from '../../src/store/roomStoreFactory';
import processorFactory from '../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers, {baseCommandSchema} from '../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../src/eventHandlers/eventHandlers';

/**
 * tests the command processor performance with the real room store (persistent storage)  but without socket connection (no json serializing, etc.)
 *
 */

test('1000 "addStory" commands/events', async () => {
  const userId = uuid();

  const roomId = 'custom-room_' + uuid();

  const store = await roomStoreFactory(false);
  const processor = processorFactory(commandHandlers, baseCommandSchema, eventHandlers, store);

  const totalEvents = 1000;
  let eventCounter = 0;
  let commandCounter = 0;

  await processor(
    {
      id: uuid(),
      name: 'joinRoom',
      roomId,
      payload: {}
    },
    userId
  );

  console.log(`--- Starting test with "addStory" until ${totalEvents} events are received --`);
  console.time('commandProcessorPerformance');

  return processor(
    {
      id: uuid(),
      roomId,
      name: 'joinRoom',
      payload: {}
    },
    userId
  )
    .then(sendAddStoryCommand)
    .then(onHandled);

  function onHandled() {
    eventCounter++;
    if (eventCounter < totalEvents) {
      return sendAddStoryCommand().then(onHandled);
    }

    console.log(
      `Performance test done. sent ${commandCounter} commands. Received ${eventCounter} events.`
    );
    console.timeEnd('commandProcessorPerformance');
    console.log('\n---');
  }

  function sendAddStoryCommand() {
    commandCounter++;

    return processor(
      {
        id: uuid(),
        roomId,
        name: 'addStory',
        payload: {
          title: `SuperStory_${commandCounter}`,
          description: 'This will be awesome'
        }
      },
      userId
    );
  }
});
