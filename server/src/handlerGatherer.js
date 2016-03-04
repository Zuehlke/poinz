const
  path = require('path'),
  glob = require('glob'),
  _ = require('lodash');

/**
 * Gathers all command handlers.
 * Validates also if all found command handler modules export a valid commandHandler object.
 **/
function gatherCommandHandlers() {
  const handlers = {};
  const handlerFiles = glob.sync(path.resolve(__dirname, './commandHandlers/**/*.js'));
  handlerFiles.forEach(handlerFile => {
    const handlerModule = require(handlerFile);
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
  const handlers = {};
  const handlerFiles = glob.sync(path.resolve(__dirname, './eventHandlers/**/*.js'));
  handlerFiles.forEach(handlerFile => {
    const handlerModule = require(handlerFile);
    if (!_.isFunction(handlerModule)) {
      throw new Error('Event Handler modules must export a function!');
    }
    handlers[path.basename(handlerFile, '.js')] = handlerModule;
  });
  return handlers;
}

module.exports = {
  gatherCommandHandlers,
  gatherEventHandlers
};
