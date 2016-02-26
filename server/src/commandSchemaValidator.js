var
  path = require('path'),
  util = require('util'),
  glob = require('glob'),
  log = require('loglevel'),
  tv4 = require('tv4');

var LOGGER = log.getLogger('commandSchemaValidator');

var schemas = gatherSchemas();

module.exports = validate;

/**
 * Validates the given command against its schema.
 * for every command (command.name) there must be a json schema with a matching file name.
 *
 * (see json schema, tv4)
 **/
function validate(cmd) {
  if (!cmd.name) {
    // without a name we can't even load the right schema
    throw new CommandValidationError(new Error('Command must contain a name'), cmd);
  }

  var schema = schemas[cmd.name];

  if (!schema) {
    throw new CommandValidationError(new Error('Cannot validate command'), cmd);
  }

  var result = tv4.validateMultiple(cmd, schema);
  if (!result.valid) {
    throw new CommandValidationError(new Error('Command validation failed.\n' + serializeErrors(result.errors)), cmd);
  }
}

function serializeErrors(tv4Errors) {
  var errs = tv4Errors.map(tv4Err => tv4Err.message + ' in ' + tv4Err.dataPath);
  return errs.join('\n');
}

/**
 * loads all json schemas
 */
function gatherSchemas() {
  LOGGER.info('loading command schemas..');

  var schemaMap = {};
  var schemaFiles = glob.sync(path.resolve(__dirname, './validationSchemas/**/*.json'));
  schemaFiles.map(schemaFile => {
    schemaMap[path.basename(schemaFile, '.json')] = require(schemaFile);
  });

  // add the default command schema, which is referenced from all others ($ref)
  tv4.addSchema(schemaMap.command);

  return schemaMap;
}


function CommandValidationError(err, cmd) {
  this.stack = err.stack;
  this.name = this.constructor.name;
  this.message = 'Command validation Error during "' + cmd.name + '": ' + err.message;
}
util.inherits(CommandValidationError, Error);


