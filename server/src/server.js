import path from 'path';
import express from 'express';

import settings from './settings';
import socketServer from './socketServer';
import commandProcessorFactory from './commandProcessor';
import logging from './logging';
import rest from './rest';
import roomsStoreFactory from './store/roomStoreFactory';
import commandHandlers from './commandHandlers/commandHandlers';
import eventHandlers from './eventHandlers/eventHandlers';

const LOGGER = logging.getLogger('server');

const app = express();

const store = roomsStoreFactory(settings.persistentStore);

// setup REST api
rest.init(app, store);

// serve static client files
app.use(express.static(path.resolve(__dirname, '../public')));
// enable html5 history mode by "forwarding" every unmatched route to the index.html file
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, '../public/index.html'));
});

const commandProcessor = commandProcessorFactory(
  commandHandlers,
  eventHandlers,
  store
);

const server = socketServer.init(app, commandProcessor);
server.listen(settings.serverPort, settings.serverHost, () => LOGGER.info(`-- SERVER STARTED -- (${ settings.serverHost }:${settings.serverPort})`));

process.on('SIGINT', () => server.close(()=> process.exit(0)));
