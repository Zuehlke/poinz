const
  path = require('path'),
  util = require('util'),
  glob = require('glob'),
  logging = require('./logging'),
  tv4 = require('tv4');

const LOGGER = logging.getLogger('commandSchemaValidator');

const schemas = gatherSchemas();

registerCustomFormats();

module.exports = validate;

/**
 * Validates the given command against its schema.
 * for every command (command.name) there must be a json schema with a matching file name.
 *
 * (see http://json-schema.org/, https://www.npmjs.com/package/tv4)
 **/
function validate(cmd) {
  if (!cmd.name) {
    // without a name we can't even load the right schema
    throw new CommandValidationError(new Error('Command must contain a name!'), cmd);
  }

  const schema = schemas[cmd.name];

  if (!schema) {
    throw new CommandValidationError(new Error(`Cannot validate command, no matching schema found for ${cmd.name}!`), cmd);
  }

  const result = tv4.validateMultiple(cmd, schema);
  if (!result.valid) {
    throw new CommandValidationError(new Error('Command validation failed!\n' + serializeErrors(result.errors)), cmd);
  }
}

function serializeErrors(tv4Errors) {
  const errs = tv4Errors.map(tv4Err => tv4Err.message + ' in ' + tv4Err.dataPath);
  return errs.join('\n');
}

/**
 * loads all json schemas
 */
function gatherSchemas() {
  LOGGER.info('loading command schemas..');

  const schemaMap = {};
  const schemaFiles = glob.sync(path.resolve(__dirname, './validationSchemas/**/*.json'));
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


const EMAIL_REGEX = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
function registerCustomFormats() {
  tv4.addFormat('email', validateEmail);
}

function validateEmail(data) {
  if (!data) {
    // allow empty string, undefined, null
    return;
  }

  if (typeof data === 'string' && EMAIL_REGEX.test(data)) {
    return null;
  }

  return 'must be a valid email-address';
}
