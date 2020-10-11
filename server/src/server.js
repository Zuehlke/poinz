import path from 'path';
import http from 'http';
import express from 'express';
import sslifyEnforce from 'express-sslify';

import settings from './settings';
import socketServer from './socketServer';
import getLogger from './getLogger';
import rest from './rest';
import storeFactory from './store/storeFactory';
import authenticatorFactory from './auth/authenticator';

const LOGGER = getLogger('server');

startup().catch((err) => {
  throw new Error(err);
});

async function startup() {
  const store = await storeFactory(settings.persistentStore);
  const authenticator = await authenticatorFactory(store);
  const app = express();

  if (process.env.NODE_ENV === 'production') {
    LOGGER.info('enabling HTTPS enforce...');
    app.use(sslifyEnforce.HTTPS({trustProtoHeader: true}));
  }

  // setup REST api
  rest.init(app, store, authenticator);

  // serve static client files
  app.use(express.static(path.resolve(__dirname, '../public')));

  // enable html5 history mode by "forwarding" every unmatched route to the index.html file
  app.get('*', (request, response) =>
    response.sendFile(path.resolve(__dirname, '../public/index.html'))
  );

  // generic error handler
  app.use((err, req, res, next) => {
    LOGGER.error(err.message + '\n' + err.stack);
    res.status(500).json({message: 'an error occurred'});
  });

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
