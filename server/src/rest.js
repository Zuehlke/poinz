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
  restRouter.get('/status', (req, res) => buildStatusObject().then(status => sendResponseObject(res, status)));
  restRouter.get('/translations', (req, res) => getTranslations(req.query.lang).then(translations => sendResponseObject(res, translations)));
  app.use('/api', restRouter);
}

/**
 * sets response content type to application/json and sends given object as json body
 *
 * @param res
 * @param object
 */
function sendResponseObject(res, object) {
  res.contentType('application/json');
  res.json(object);
}

/**
 * builds the application status object. contains information about all rooms, connected users, etc.
 *
 * @returns {Promise.<Immutable.List>}
 */
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


/**
 * return translations for given language
 *
 * @param {string} language a two char language code (e.g. "en" or "de")
 */
function getTranslations(language) {
  debugger;
}

module.exports = {init};
