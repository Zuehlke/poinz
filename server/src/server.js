import path from 'path';
import express from 'express';

import settings from './settings';
import socketServer from './socketServer';
import handlerGatherer from './handlerGatherer';
import commandProcessorFactory from './commandProcessor';
import logging from './logging';
import rest from './rest';
import roomsStore from './roomsStore';

const LOGGER = logging.getLogger('server');

const app = express();

// setup REST api
rest.init(app);

// serve static client files
app.use(express.static(path.resolve(__dirname, '../public')));
// enable html5 history mode by "forwarding" every unmatched route to the index.html file
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, '../public/index.html'));
});

const commandProcessor = commandProcessorFactory(
  handlerGatherer.gatherCommandHandlers(),
  handlerGatherer.gatherEventHandlers(),
  roomsStore
);

const server = socketServer.init(app, commandProcessor);
server.listen(settings.serverPort, settings.serverHost, function () {
  LOGGER.info('-- SERVER STARTED -- (' + settings.serverHost + ':' + settings.serverPort + ')');
});

process.on('SIGINT', function () {
  server.close(()=> process.exit(0));
});
