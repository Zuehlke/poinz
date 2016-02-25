import socketIo from 'socket.io-client';
import log from 'loglevel';
import { v4 as uuid } from 'node-uuid';
import { EVENT_ACTION_TYPES } from './actionTypes';

const LOGGER = log.getLogger('hub');


function hubFactory(dispatch) {

  const appConfig = __POINZ_CONFIG__; // this is set via webpack (see webpack.config.js and webpack.production.config.js)
  const io = (appConfig.wsUrl) ? socketIo(appConfig.wsUrl) : socketIo();

  io.on('connect', () => log.info('socket to server connected'));
  io.on('disconnect', () => log.info('socket from server disconnected'));
  io.on('event', handleIncomingEvent);

  function handleIncomingEvent(event) {
    // for every incoming event, there must be a matching action type
    const matchingType = EVENT_ACTION_TYPES[event.name];
    if (!matchingType) {
      LOGGER.error('Unknown event type' + event.name);
      return;
    }
    dispatch({
      type: matchingType,
      event
    });
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
