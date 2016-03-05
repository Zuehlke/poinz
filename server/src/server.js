const
  path = require('path'),
  express = require('express'),
  socketServer = require('./socketServer'),
  handlerGatherer = require('./handlerGatherer'),
  commandProcessorFactory = require('./commandProcessor'),
  logging = require('./logging'),
  roomsStore = require('./roomsStore');

const LOGGER = logging.getLogger('server');
const serverHost = '0.0.0.0';
const serverPort = 3000;

const app = express();

// serve static client files
app.use(express.static(path.resolve(__dirname, '../public')));
// enable html5 history mode
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, '../public/index.html'));
});

const commandProcessor = commandProcessorFactory(
  handlerGatherer.gatherCommandHandlers(),
  handlerGatherer.gatherEventHandlers(),
  roomsStore
);

socketServer
  .init(app, commandProcessor)
  .listen(serverPort, serverHost, function () {
    LOGGER.info('-- SERVER STARTED -- (' + serverHost + ':' + serverPort + ')');
  });
