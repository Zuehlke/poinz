import socketIo from 'socket.io-client';
import log from 'loglevel';
import {v4 as uuid} from 'uuid';

import appConfig from './appConfig';
import {COMMAND_SENT} from '../actions/types';

/**
 * The Hub  is our interface between the websocket connection and the app
 * - Can send commands over the websocket
 * - Receives backend events from the websocket
 *
 * @param {function} dispatch The redux dispatch function
 * @param {function} getUserId Callback that provides the current userId
 * @return {{sendCommand: sendCommand, io: {emit: io.emit}, onEvent: onEvent}} a/the Hub instance
 */
export default function hubFactory(dispatch, getUserId) {
  let io;
  let onEventHandler;

  if (appConfig.env === 'test') {
    // during test, there is no browser. thus we cannot instantiate socket.io!
    io = {
      emit: () => {}
    };
  } else {
    io = appConfig.wsUrl ? socketIo(appConfig.wsUrl) : socketIo();
    io.on('connect', () => log.info('socket connected to server'));
    io.on('disconnect', () => log.info('socket from server disconnected'));
    io.on('event', (ev) => {
      debugReceivedEvent(ev);
      onEventHandler(ev);
    });
  }

  return {
    io,
    onEvent,
    sendCommand
  };

  function onEvent(onEventCb) {
    onEventHandler = onEventCb;
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

    io.emit('command', command);

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
