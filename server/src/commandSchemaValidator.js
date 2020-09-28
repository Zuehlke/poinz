import path from 'path';
import fs from 'fs';
import util from 'util';
import tv4 from 'tv4';

import getLogger from './getLogger';

import commandHandlers from './commandHandlers/commandHandlers';

const LOGGER = getLogger('commandSchemaValidator');

const EMAIL_REGEX = /^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
const EMAIL_MAX_LENGTH = 254;
const ROOMID_REGEX = /^[-a-z0-9_]+$/;
const UUIDv4_REGEX = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
const CsvDATAURL_REGEX = /^data:(text\/csv|application\/vnd.ms-excel|application\/csv|text\/x-csv|application\/x-csv|text\/comma-separated-values|text\/x-comma-separated-values);base64,/;
const USERNAME_REGEX = /^.{3,80}$/;
const schemas = gatherSchemas();

registerCustomFormats();

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
    throw new CommandValidationError(
      new Error(`Cannot validate command, no matching schema found for "${cmd.name}"!`),
      cmd
    );
  }

  const result = tv4.validateMultiple(cmd, schema);
  if (!result.valid) {
    throw new CommandValidationError(new Error(serializeErrors(result.errors)), cmd);
  }
}

function serializeErrors(tv4Errors) {
  const errs = tv4Errors.map((tv4Err) => tv4Err.message + ' in ' + tv4Err.dataPath);
  return errs.join('\n');
}

/**
 * loads all json schemas
 */
function gatherSchemas() {
  LOGGER.info('loading command schemas defined in command handlers...');

  const handlerEntries = Object.entries(commandHandlers);

  const schemaMap = handlerEntries.reduce((total, currentEntry) => {
    if (!currentEntry[1].schema) {
      throw new Error(
        `Fatal error: CommandHandler "${currentEntry[0]}" does not define "schema" !`
      );
    }
    total[currentEntry[0]] = currentEntry[1].schema;
    return total;
  }, {});

  // add the base command schema, which is referenced from all others (    $ref: 'command'    )
  const baseCommandSchema = path.resolve(__dirname, './commandHandlers/command.json');
  const schemaFileContent = fs.readFileSync(baseCommandSchema, 'utf-8');
  tv4.addSchema(JSON.parse(schemaFileContent));

  return schemaMap;
}

function registerCustomFormats() {
  tv4.addFormat('email', (data) => {
    if (data.length > EMAIL_MAX_LENGTH) {
      return `string must not be more than ${EMAIL_MAX_LENGTH} characters`;
    }
    return validateStringFormat(EMAIL_REGEX, 'must be a valid email-address', data);
  });
  tv4.addFormat(
    'roomId',
    validateStringFormat.bind(
      undefined,
      ROOMID_REGEX,
      'must be a valid roomId: only the following characters are allowed: a-z 0-9 _ -'
    )
  );
  tv4.addFormat(
    'uuidv4',
    validateStringFormat.bind(undefined, UUIDv4_REGEX, 'must be a valid uuid v4')
  );
  tv4.addFormat(
    'csvDataUrl',
    validateStringFormat.bind(undefined, CsvDATAURL_REGEX, 'must be a valid text/csv data url')
  );
  tv4.addFormat(
    'username',
    validateStringFormat.bind(undefined, USERNAME_REGEX, 'must be a valid username')
  );
}

function validateStringFormat(formatRegex, errorMsg, data) {
  if (!data) {
    return; // allow empty string, undefined, null
  }

  if (typeof data === 'string' && formatRegex.test(data)) {
    return null;
  }

  return errorMsg;
}

function CommandValidationError(err, cmd) {
  this.stack = err.stack;
  this.name = this.constructor.name;
  this.message = `Command validation Error during "${cmd.name}": ${err.message}`;
}

util.inherits(CommandValidationError, Error);
