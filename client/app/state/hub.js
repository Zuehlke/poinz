import log from 'loglevel';

import uuid from '../services/uuid';
import appConfig from '../services/appConfig';
import {COMMAND_SENT} from './actions/commandActions';

/**
 * The Hub  is our interface between the websocket connection and the app
 * - Can send commands over the websocket
 * - Receives backend events from the websocket
 *
 * @param {function} dispatch The redux dispatch function
 * @param {function} getUserId Callback that provides the current userId (if any)
 * @param {function} getRoomId Callback that provides the current roomId (if any)
 * @return {{onConnect: onConnect, sendCommand: sendCommand, onEvent: onEvent}}  a/the Hub instance
 */
export default function hubFactory(dispatch, getUserId, getRoomId) {
  let ioInstance;
  let onEventHandler;
  let onConnectHandler;

  if (appConfig.env === 'test') {
    // during test, there is no browser. thus we cannot instantiate socket.io!
    ioInstance = {
      emit: () => {}
    };
  } else {
    ioInstance = io();
    ioInstance.on('connect', () => {
      log.info('socket connected to server');
      onConnectHandler();
    });
    ioInstance.on('disconnect', () => log.info('socket from server disconnected'));
    ioInstance.on('event', (ev) => {
      debugReceivedEvent(ev);
      onEventHandler(ev);
    });
  }

  return {
    onEvent,
    onConnect,
    sendCommand
  };

  function onEvent(onEventCb) {
    onEventHandler = onEventCb;
  }

  function onConnect(onConnectCb) {
    onConnectHandler = onConnectCb;
  }

  /**
   * Sends a given command to the backend over the websocket connection
   * @param {object} command the command to send
   */
  function sendCommand(command) {
    command.id = uuid();

    if (!command.userId) {
      command.userId = getUserId();
    }

    if (!command.roomId) {
      command.roomId = getRoomId();
    }

    ioInstance.emit('command', command);

    debugSentCommand(command);

    dispatch({
      type: COMMAND_SENT,
      command
    });
  }
}

function debugSentCommand(command) {
  if (log.getLevel() > log.levels.DEBUG) {
    return;
  }

  console.groupCollapsed('%c %s', 'color:#2b827b', command.name);
  console.dir(command);
  console.groupEnd();
}

function debugReceivedEvent(ev) {
  if (log.getLevel() > log.levels.DEBUG) {
    return;
  }

  console.groupCollapsed('%c %s', 'color:#2b4e82', ev.name);
  console.dir(ev);
  console.groupEnd();
}
