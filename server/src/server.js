const
  path = require('path'),
  express = require('express'),
  settings = require('./settings'),
  socketServer = require('./socketServer'),
  handlerGatherer = require('./handlerGatherer'),
  commandProcessorFactory = require('./commandProcessor'),
  logging = require('./logging'),
  rest = require('./rest'),
  roomsStore = require('./roomsStore');

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
