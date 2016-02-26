var log = require('loglevel');
log.setLevel('info');

var
  path = require('path'),
  express = require('express'),
  socketServer = require('./socketServer'),
  handlerGatherer = require('./handlerGatherer'),
  commandProcessorFactory = require('./commandProcessor');

// if deployed on redhat openshift, use env settings
var serverHost = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
var serverPort = process.env.OPENSHIFT_NODEJS_PORT || 3000;

var app = express();

// routes setup
app.use(express.static(path.resolve(__dirname, '../public')));
// enable html5 history mode
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, '../public/index.html'));
});

var commandProcessor = commandProcessorFactory(handlerGatherer.gatherCommandHandlers(), handlerGatherer.gatherEventHandlers());
var server = socketServer.init(app, commandProcessor);
server.listen(serverPort, serverHost, function () {
  log.info('-- SERVER STARTED -- (' + serverHost + ':' + serverPort + ')');
});
