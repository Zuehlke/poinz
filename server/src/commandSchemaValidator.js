import path from 'path';
import fs from 'fs';
import util from 'util';
import glob from 'glob';
import tv4 from  'tv4';

import logging from './logging';

const LOGGER = logging.getLogger('commandSchemaValidator');

const schemas = gatherSchemas();

export default validate;

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
    throw new CommandValidationError(new Error(`Cannot validate command, no matching schema found for "${cmd.name}"!`), cmd);
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
  const schemaFiles = glob.sync(path.resolve(__dirname, '../resources/validationSchemas/**/*.json'));

  LOGGER.info(`got ${schemaFiles.length} schema files...`);

  schemaFiles.map(schemaFile => {
    const schemaFileContent = fs.readFileSync(schemaFile, 'utf-8');
    const schemaName = path.basename(schemaFile, '.json');
    schemaMap[schemaName] = parseSchemaFile(schemaFileContent, schemaFile);
  });

  // add the default command schema, which is referenced from all others ($ref)
  tv4.addSchema(schemaMap.command);

  return schemaMap;
}

function parseSchemaFile(schemaFileContent, schemaFileName) {
  try {
    return JSON.parse(schemaFileContent);
  } catch (err) {
    LOGGER.error(`Could not parse schema file ${schemaFileName}.`, err);
  }
}

function CommandValidationError(err, cmd) {
  this.stack = err.stack;
  this.name = this.constructor.name;
  this.message = `Command validation Error during "${cmd.name}": ${err.message}`;
}
util.inherits(CommandValidationError, Error);


