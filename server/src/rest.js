import express from 'express';
import stream from 'stream';

import caem from './catchAsyncErrorsMiddleware';
import getLogger from './getLogger';

const LOGGER = getLogger('rest');

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
 * @param store
 * @param authenticator
 */
function init(app, store, authenticator) {
  const restRouter = express.Router();

  /**
   * poinz client needs to know github clientId
   */
  restRouter.get(
    '/auth/config',
    caem(async (req, res) => {
      const config = await store.getAppConfig();
      res.json({githubClientId: config.githubAuthClientId});
    })
  );

  /**
   * client can request a new jwt with a valid github "code"
   */
  restRouter.get(
    '/auth/jwt',
    caem(async (req, res) => {
      try {
        const jwt = await authenticator.requestJWT(req.query.code);
        res.send(jwt);
      } catch (e) {
        LOGGER.info(e.message);
        res.status(403).send({error: 'Not Authorized'});
      }
    })
  );

  /**
   * protect route '/status' : request must have valid jwt token in Header:   "Authorization: Bearer [JWT]"
   */
  restRouter.use(
    '/status',
    caem(async (req, res, next) => {
      try {
        const authHeaderField = req.get('Authorization');
        req.user = await authenticator.validateJWT(authHeaderField);
        next();
      } catch (e) {
        LOGGER.info(e.message);
        res.status(403).send({error: 'Not Authorized'});
      }
    })
  );

  restRouter.get('/status', (req, res) =>
    buildStatusObject(store).then((status) => res.json(status))
  );

  /**
   * export room (an estimation "session") as json or file
   */
  restRouter.get('/room/:roomId', (req, res) =>
    buildRoomExportObject(store, req.params.roomId).then((roomExport) => {
      if (!roomExport) {
        res.status(404).json({message: 'room not found'});
        return;
      }

      if (req.query && req.query.mode === 'file') {
        sendObjectAsJsonFile(res, roomExport, `poinz_${roomExport.roomId}.json`);
      } else {
        res.json(roomExport);
      }
    })
  );

  app.use('/api', restRouter);
}

export default {init};

function sendObjectAsJsonFile(res, data, filename) {
  const fileContents = Buffer.from(JSON.stringify(data, null, 4), 'utf-8');
  const readStream = new stream.PassThrough();
  readStream.end(fileContents);
  res.set('Content-disposition', 'attachment; filename=' + filename);
  res.set('Content-Type', 'application/json');
  readStream.pipe(res);
}

export async function buildStatusObject(store) {
  const allRooms = await store.getAllRooms();

  const rooms = Object.values(allRooms).map((room) => ({
    id: room.id,
    storyCount: Object.values(room.stories).length,
    userCount: Object.values(room.users).length,
    userCountDisconnected: Object.values(room.users).filter((user) => user.disconnected).length,
    lastActivity: room.lastActivity,
    markedForDeletion: room.markedForDeletion,
    created: room.created
  }));

  return {
    rooms,
    roomCount: rooms.length,
    uptime: Math.floor(process.uptime()),
    storeInfo: store.getStoreType()
  };
}

export async function buildRoomExportObject(store, roomId) {
  const room = await store.getRoomById(roomId);
  if (!room) {
    return undefined;
  }

  return {
    roomId: room.id,
    exportedAt: Date.now(),
    stories: Object.values(room.stories)
      .filter((story) => !story.trashed)
      .map((story) => buildStoryExportObject(story, room.users))
  };
}

const buildStoryExportObject = (story, users) => ({
  title: story.title,
  description: story.description,
  estimations: Object.entries(story.estimations).map((entry) => {
    const matchingUser = users[entry[0]];
    return {username: matchingUser ? matchingUser.username : entry[0], value: entry[1]};
  })
});
