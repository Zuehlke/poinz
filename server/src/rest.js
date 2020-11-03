import express from 'express';
import stream from 'stream';
import defaultCardConfig from './defaultCardConfig';

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

  restRouter.get('/status', async (req, res) => {
    const status = await buildStatusObject(store);
    res.json(status);
  });

  restRouter.get('/export/room/:roomId', async (req, res) => {
    const roomExport = await buildRoomExportObject(store, req.params.roomId);

    if (!roomExport) {
      res.status(404).json({message: 'room not found'});
      return;
    }

    if (req.query && req.query.mode === 'file') {
      sendObjectAsJsonFile(res, roomExport, `poinz_${roomExport.roomId}.json`);
    } else {
      res.json(roomExport);
    }
  });

  restRouter.get('/room/:roomId', async (req, res) => {
    const roomState = await buildRoomStateObject(store, req.params.roomId);

    if (!roomState) {
      res.status(404).json({message: 'room not found'});
      return;
    }
    res.json(roomState);
  });

  app.use('/api', restRouter);
}

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
    storyCount: room.stories.length,
    userCount: room.users.length,
    userCountDisconnected: room.users.filter((user) => user.disconnected).length,
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
    stories: room.stories
      .filter((story) => !story.trashed)
      .map((story) => buildStoryExportObject(story, room.users))
  };
}

const buildStoryExportObject = (story, users) => {
  const usernamesMap = users.reduce((total, currentUser) => {
    total[currentUser.id] = currentUser.username || currentUser.id;
    return total;
  }, {});

  return {
    title: story.title,
    description: story.description,
    estimations: Object.entries(story.estimations).map((entry) => {
      const matchingUser = usernamesMap[entry[0]];
      return {username: matchingUser ? matchingUser : entry[0], value: entry[1]};
    })
  };
};

/**
 * This should return the same information as contained in the "joinedRoom" event.
 */
export async function buildRoomStateObject(store, roomId) {
  const room = await store.getRoomById(roomId);
  if (!room) {
    return undefined;
  }
  const {autoReveal, id, selectedStory, stories, users, cardConfig} = room;

  return {
    autoReveal,
    id,
    selectedStory,
    stories,
    users,
    cardConfig: cardConfig ? cardConfig : defaultCardConfig
  };
}
