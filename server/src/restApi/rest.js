import express from 'express';
import {json as jsonParser} from 'body-parser';

import {validateJwt} from '../auth/jwtService';
import {mapAppStatusDto, mapRoomExportDto, mapRoomStateDto} from './dtoMapper';
import getLogger from '../getLogger';

const CLIENT_ERROR_LOGGER = getLogger('clientError');

/**
 * This module handles incoming requests to the REST api.
 *
 * Not a very extensive API... Most of the (user-interaction triggered) communication between client and server (story-, estimation- and user-related)
 * is done via websocket connection.
 *
 * @param app the express app object
 * @param store the roomsStore object
 */
export default function restApiFactory(app, store) {
  const restRouter = express.Router();
  const jsonRequestBodyParser = jsonParser();

  app.use('/api', restRouter);

  restRouter.get('/status', async (req, res) => {
    const allRooms = await store.getAllRooms();
    const status = mapAppStatusDto(allRooms, store.getStoreType());
    res.json(status);
  });

  restRouter.post('/errorlog', jsonRequestBodyParser, async (req, res) => {
    validateSanitizeAndLogError(req.body);
    res.sendStatus(200);
  });

  restRouter.get('/export/room/:roomId', userIdInRoomCheck, async (req, res) => {
    const room = await store.getRoomById(req.params.roomId);
    const roomExport = mapRoomExportDto(room);

    if (!roomExport) {
      res.status(404).json({message: 'room not found'});
      return;
    }

    res.json(roomExport);
  });

  restRouter.get('/room/:roomId', userIdInRoomCheck, async (req, res) => {
    const room = await store.getRoomById(req.params.roomId);
    const roomState = mapRoomStateDto(room);

    if (!roomState) {
      res.status(404).json({message: 'room not found'});
      return;
    }
    res.json(roomState);
  });

  /**
   * Express middleware function for fetching/exporting rooms:
   * Checks if a valid JWT is passed in the request and that the specified user belongs to a specific room and is thus allowed to fetch information about this room.
   *
   * Use this middleware for routes with :roomId  path parameter!
   * Request is expected to specify Header Field "Authorization"
   * Value of Header Field "Authorization" must contain a valid (issued by us, not expired) JWT and match userId of one of the users in the room
   *
   * @param req
   * @param res
   * @param next
   * @return {Promise<void>}
   */
  async function userIdInRoomCheck(req, res, next) {
    const {
      params: {roomId}
    } = req;

    try {
      const isOK = await canUserReadRoom(roomId, req.get('Authorization'));
      if (isOK) {
        next();
      } else {
        res.status(403).json({message: 'Forbidden'});
      }
    } catch (e) {
      res.status(404).json({message: 'room not found'});
    }
  }

  /**
   *
   * @param roomId
   * @param {string} authorizationHeaderField
   * @return {Promise<boolean>}
   */
  async function canUserReadRoom(roomId, authorizationHeaderField) {
    if (!roomId) {
      throw new Error('no such room');
    }
    const room = await store.getRoomById(roomId);
    if (!room) {
      throw new Error('no such room');
    }
    if (!room.password) {
      return true;
    }

    if (!authorizationHeaderField || authorizationHeaderField.length < 8) {
      return false;
    }
    const token = authorizationHeaderField.substring(7);
    if (!token) {
      return false;
    }

    const payload = validateJwt(token, roomId);
    if (!payload) {
      return false;
    }
    return !!room.users.find((usr) => usr.id === payload.sub);
  }

  function validateSanitizeAndLogError(requestBody) {
    if (
      !requestBody ||
      Object.keys(requestBody).length !== 2 ||
      !requestBody.type ||
      typeof requestBody.type !== 'string' ||
      typeof requestBody.error !== 'string'
    ) {
      return;
    }
    CLIENT_ERROR_LOGGER.warn(
      `${requestBody.type} ${requestBody.error.substring(0, 600).replace(/\n/g, ' ')}`
    );
  }
}
