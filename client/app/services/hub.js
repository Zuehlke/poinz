import socketIo from 'socket.io-client';
import log from 'loglevel';
import { v4 as uuid } from 'node-uuid';
const LOGGER = log.getLogger('hub');

const io = socketIo('http://localhost:3000');
// const io = socketIo(); // for deployment env, use empty consturctor // TODO: configure webpack bild -> env variables

function sendCommand(cmd) {
  cmd.id = uuid();
  io.emit('command', cmd);
}

function hubFactory(actions) {

  io.on('connect', () => log.info('socket to server connected'));
  io.on('disconnect', () => log.info('socket from server disconnected'));
  io.on('event', handleIncomingEvent);

  function handleIncomingEvent(event) {
    // for every incoming event, there must be a redux action to handle it
    const eventHandlerAction = actions[event.name];
    if (!eventHandlerAction) {
      LOGGER.error('No handler action for event ' + event.name);
      return;
    }
    eventHandlerAction(event);
  }

  return {
    sendCommand
  };
}

export default hubFactory;
