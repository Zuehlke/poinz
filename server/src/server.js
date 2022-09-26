import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import express from 'express';
import sslifyEnforce from 'express-sslify';

import settings from './settings.js';
import socketServer from './socketServer.js';
import getLogger from './getLogger.js';
import restApiFactory from './restApi/rest.js';
import roomsStoreFactory from './store/roomStoreFactory.js';

const LOGGER = getLogger('server');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

startup().catch((err) => {
  LOGGER.error('Could not start up! ' + err.message);
  process.exit(1);
});

async function startup() {
  const store = await roomsStoreFactory(settings.persistentStore);
  const app = express();

  if (process.env.NODE_ENV === 'production') {
    LOGGER.info('enabling HTTPS enforce...');
    app.use(sslifyEnforce.HTTPS({trustProtoHeader: true}));
  }

  // setup REST api
  restApiFactory(app, store);

  // serve static client files
  app.use(express.static(path.resolve(__dirname, '../public')));

  // enable html5 history mode by "forwarding" every unmatched route to the index.html file
  app.get('*', (request, response) =>
    response.sendFile(path.resolve(__dirname, '../public/index.html'))
  );

  const httpServer = http.createServer(app);
  socketServer.init(httpServer, store);

  httpServer.listen(settings.serverPort, () =>
    LOGGER.info(`-- SERVER STARTED -- (${settings.serverPort})`)
  );

  process.on('SIGINT', () => {
    LOGGER.info('-- SERVER RECEIVED SIGINT, shutting down --');
    socketServer.close();
    httpServer.close(() => process.exit(0));
  });
}
