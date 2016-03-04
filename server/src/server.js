const log = require('loglevel');
log.setLevel('info');

const
  path = require('path'),
  express = require('express'),
  socketServer = require('./socketServer'),
  handlerGatherer = require('./handlerGatherer'),
  commandProcessorFactory = require('./commandProcessor'),
  roomsStore = require('./roomsStore');

const serverHost = '0.0.0.0';
const serverPort = 3000;

const app = express();

// routes setup
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
const server = socketServer.init(app, commandProcessor);
server.listen(serverPort, serverHost, function () {
  log.info('-- SERVER STARTED -- (' + serverHost + ':' + serverPort + ')');
});
