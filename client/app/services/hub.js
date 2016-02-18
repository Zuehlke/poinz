import socketIo from 'socket.io-client';
import log from 'loglevel';
import interfaceMsgs from '../../../interfaceMessageNames';
import { v4 as uuid } from 'node-uuid';
const LOGGER = log.getLogger('hub');

const io = socketIo('http://localhost:3000');

function sendCommand(cmd) {
  cmd.id = uuid();
  io.emit(interfaceMsgs.COMMAND, cmd);
}

function hubFactory(actions) {

  io.on('connect', () => log.info('socket to server connected'));
  io.on(interfaceMsgs.DISCONNECT, () => log.info('socket from server disconnected'));
  io.on(interfaceMsgs.EVENT, handleIncomingEvent);

  function handleIncomingEvent(event) {
    const eventHandler = actions[event.name];
    if (!eventHandler) {
      LOGGER.error('No handler for event ' + event.name);
      return;
    }
    eventHandler(event);
  }

  return {
    sendCommand
  };
}

export default hubFactory;
