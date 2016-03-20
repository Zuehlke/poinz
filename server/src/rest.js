const
  Immutable = require('immutable'),
  express = require('express'),
  roomsStore = require('./roomsStore');

/**
 * This module handles incoming requests to the REST api.
 * Currently there is only one endpoint: /api/status
 *
 * All other communication between client and server (story-, estimation- and user-related)
 * is done via websocket connection.
 *
 */

/**
 *
 * @param app the express app object
 */
function init(app) {
  var restRouter = express.Router();
  restRouter.get('/status', handleStatusRequest);
  app.use('/api', restRouter);
}

function handleStatusRequest(req, res) {
  buildStatusObject().then(status => {
    res.contentType('application/json');
    res.json(status);
  });
}

function buildStatusObject() {
  return roomsStore
    .getAllRooms()
    .then(allRooms => {
      const rooms = allRooms
      // the status page in the client is technically also a room. do not include it in the result.
        .filter(room => room && room.get('id') !== 'poinzstatus')
        .map(room => new Immutable.Map({
          userCount: room.get('users').size,
          userCountDisconnected: room.get('users').filter(user => user.get('disconnected')).size,
          lastActivity: room.get('lastActivity'),
          created: room.get('created')
        }))
        .toList()
        .toJS();

      return {
        rooms,
        roomCount: rooms.length,
        uptime: Math.floor(process.uptime())
      };
    });
}

module.exports = {init};
