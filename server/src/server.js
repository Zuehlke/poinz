var log = require('loglevel');
log.setLevel('info');

var
  path = require('path'),
  glob = require('glob'),
  express = require('express'),
  _ = require('lodash'),
  socketServer = require('./socketServer'),
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

var commandProcessor = commandProcessorFactory(gatherCommandHandlers(), gatherEventHandlers());
var server = socketServer.init(app, commandProcessor);
server.listen(serverPort, serverHost, function () {
  log.info('-- SERVER STARTED -- (' + serverHost + ':' + serverPort + ')');
});

/**
 * Gathers all command handlers.
 * Validates also if all found command handler modules export a valid commandHandler object.
 **/
function gatherCommandHandlers() {
  var handlers = {};
  var handlerFiles = glob.sync(path.resolve(__dirname, './commandHandlers/**/*.js'));
  handlerFiles.forEach(handlerFile => {
    var handlerModule = require(handlerFile);
    if (!_.isPlainObject(handlerModule) || !_.isFunction(handlerModule.fn)) {
      throw new Error('Command Handler modules must export an object containing a property "fn" !');
    }
    handlers[path.basename(handlerFile, '.js')] = handlerModule;
  });
  return handlers;
}

/**
 * Gathers all event handlers.
 * Validates also if all found event handler modules export a function.
 */
function gatherEventHandlers() {
  var handlers = {};
  var handlerFiles = glob.sync(path.resolve(__dirname, './eventHandlers/**/*.js'));
  handlerFiles.forEach(handlerFile => {
    var handlerModule = require(handlerFile);
    if (!_.isFunction(handlerModule)) {
      throw new Error('Event Handler modules must export a function!');
    }
    handlers[path.basename(handlerFile, '.js')] = handlerModule;
  });
  return handlers;
}
