var log = require('loglevel');
log.setLevel('debug');

var
  path = require('path'),
  glob = require('glob'),
  express = require('express'),
  socketServer = require('./socketServer'),
  commandProcessorFactory = require('./commandProcessor');

var app = express();

// routes setup
app.get('/', function (req, res) {
  res.send('Hello World')
});
// TODO: add static serve of built client (for production)

var commandProcessor = commandProcessorFactory(gatherCommandHandlers(), gatherEventHandlers());
var server = socketServer.init(app, commandProcessor);
server.listen(3000, function () {
  log.info('-- SERVER STARTED --');
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
