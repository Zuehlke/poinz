import Immutable from 'immutable';
import express from 'express';

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
 * @param store the roomsStore object
 */
function init(app, store) {

  const restRouter = express.Router();
  restRouter.get('/status', (req, res) => buildStatusObject().then(status => res.json(status)));
  app.use('/api', restRouter);

  function buildStatusObject() {
    return store
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
}

export default {init};
