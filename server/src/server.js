var log = require('loglevel');
log.setLevel('debug');

var
  path = require('path'),
  glob = require('glob'),
  express = require('express'),
  socketServer = require('./socketServer'),
  commandProcessorFactory = require('./commandProcessor');

// if deployed on redhat openshift, use env settings
var serverHost = process.env.OPENSHIFT_NODEJS_IP || 'localhost';
var serverPort = process.env.OPENSHIFT_NODEJS_PORT || 3000;

var app = express();

// routes setup
app.use(express.static(path.resolve(__dirname, '../public')));

var commandProcessor = commandProcessorFactory(gatherCommandHandlers(), gatherEventHandlers());
var server = socketServer.init(app, commandProcessor);
server.listen(serverPort, serverHost, function () {
  log.info('-- SERVER STARTED -- (' + serverHost + ':' + serverPort + ')');
});

function gatherCommandHandlers() {
  var handlers = {};
  var handlerFiles = glob.sync(path.resolve(__dirname, './commandHandlers/**/*.js'));
  handlerFiles.map(function (handlerFile) {
    handlers[path.basename(handlerFile, '.js')] = require(handlerFile);
  });
  return handlers;
}

function gatherEventHandlers() {
  var handlers = {};
  var handlerFiles = glob.sync(path.resolve(__dirname, './eventHandlers/**/*.js'));
  handlerFiles.map(function (handlerFile) {
    handlers[path.basename(handlerFile, '.js')] = require(handlerFile);
  });
  return handlers;
}
