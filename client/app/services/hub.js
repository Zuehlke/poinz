import socketIo from 'socket.io-client';
import log from 'loglevel';
import { v4 as uuid } from 'node-uuid';
const LOGGER = log.getLogger('hub');

function hubFactory(actions) {

  const appConfig = __SPLUSH_CONFIG__; // this is set via webpack (see webpack.config.js and webpack.production.config.js)
  const io = (appConfig.env === 'production') ? socketIo(appConfig.wsUrl) : socketIo('http://localhost:3000');

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

  function sendCommand(cmd) {
    cmd.id = uuid();
    io.emit('command', cmd);
  }
}

export default hubFactory;
