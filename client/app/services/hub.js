import {EventEmitter} from 'events';
import {inherits} from 'util';

import socketIo from 'socket.io-client';
import log from 'loglevel';
import {v4 as uuid} from 'uuid';

import appConfig from './appConfig';
import {COMMAND_SENT} from '../actions/types';

/**
 * The Hub  is our interface between the websocket connection and the app.
 * - Can send commands over the websocket
 * - Receives backend events from the websocket
 *
 */
function Hub() {
  EventEmitter.call(this);

  if (appConfig.env === 'test') {
    this.io = {
      emit: () => {}
    };
    // during test, there is no browser. thus we cannot instantiate socket.io!
    return;
  }

  this.io = appConfig.wsUrl ? socketIo(appConfig.wsUrl) : socketIo();

  this.io.on('connect', () => log.info('socket connected to server'));
  this.io.on('disconnect', () => log.info('socket from server disconnected'));

  this.io.on('event', (ev) => {
    debugReceivedEvent(ev);

    this.emit('event', ev);
  });
}

inherits(Hub, EventEmitter);

/**
 * Sends a given command to the backend over the websocket connection
 * @param {object} command the command to send
 * @param {function} dispatch
 */
Hub.prototype.sendCommand = function sendCommand(command, dispatch) {
  command.id = uuid();

  this.io.emit('command', command);

  debugSentCommand(command);

  dispatch({
    type: COMMAND_SENT,
    command
  });
};

const hubInstance = new Hub();

export default hubInstance;

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
