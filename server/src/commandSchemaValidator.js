import util from 'util';
import tv4 from 'tv4';

import getLogger from './getLogger';

const LOGGER = getLogger('commandSchemaValidator');

const EMAIL_REGEX = /^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
const EMAIL_MAX_LENGTH = 254;
const ROOMID_REGEX = /^[-a-z0-9_]+$/;
const UUIDv4_REGEX = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
const CsvDATAURL_REGEX = /^data:(text\/csv|application\/vnd.ms-excel|application\/csv|text\/x-csv|application\/x-csv|text\/comma-separated-values|text\/x-comma-separated-values);base64,/;
const USERNAME_REGEX = /^.{3,80}$/;

/**
 * Creates a new instance of the validator-function
 *
 * Every command that is received by the server is checked for structural integrity (i.e. adheres to its defined schema).
 * The schema is defined as v4 json schema on the respective commandHandler.
 * Every command is checked against its schema via "tv4" (See https://github.com/geraintluff/tv4)
 *
 * @param {object} commandSchemas An object containing all schemas for all commands
 * @return {function} A new validate function
 */
export default function commandSchemaValidatorFactory(commandSchemas) {
  const tvInstance = tv4.freshApi();

  // add the base command schema, which is referenced from all others (    $ref: 'command'    )
  if (!commandSchemas.command) {
    throw new Error('Fatal Error: given commandSchemas object must contain a schema "command"');
  }
  tvInstance.addSchema(commandSchemas.command);

  registerCustomFormats(tvInstance);

  return validate;

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

    const schema = commandSchemas[cmd.name];

    if (!schema) {
      throw new CommandValidationError(
        new Error(`Cannot validate command, no matching schema found for "${cmd.name}"!`),
        cmd
      );
    }

    const result = tvInstance.validateMultiple(cmd, schema); // "validateMultiple" does not stop on first error, but collects all errors
    if (!result.valid) {
      throw new CommandValidationError(new Error(serializeErrors(result.errors)), cmd);
    }
  }
}

/**
 * registers our custom formats like "username" "email" "roomId" "uuid"  with the given tv4 instance
 * @param tvi
 */
function registerCustomFormats(tvi) {
  tvi.addFormat('email', (data) => {
    if (data.length > EMAIL_MAX_LENGTH) {
      return `string must not be more than ${EMAIL_MAX_LENGTH} characters`;
    }
    return validateStringFormat(EMAIL_REGEX, 'must be a valid email-address', data);
  });
  tvi.addFormat(
    'roomId',
    validateStringFormat.bind(
      undefined,
      ROOMID_REGEX,
      'must be a valid roomId: only the following characters are allowed: a-z 0-9 _ -'
    )
  );
  tvi.addFormat(
    'uuidv4',
    validateStringFormat.bind(undefined, UUIDv4_REGEX, 'must be a valid uuid v4')
  );
  tvi.addFormat(
    'csvDataUrl',
    validateStringFormat.bind(undefined, CsvDATAURL_REGEX, 'must be a valid text/csv data url')
  );
  tvi.addFormat(
    'username',
    validateStringFormat.bind(undefined, USERNAME_REGEX, 'must be a valid username')
  );
  tvi.addFormat('cardConfig', validateCardConfig);
}

/**
 * loads all command validation schemas
 */
export function getSchemasFromRealCommandHandlers(commandHandlers) {
  LOGGER.info('gathering command schemas defined in given command handlers...');

  return Object.entries(commandHandlers).reduce((total, currentEntry) => {
    total[currentEntry[0]] = currentEntry[1].schema;
    return total;
  }, {});
}

function serializeErrors(tv4Errors) {
  const errs = tv4Errors.map((tv4Err) => tv4Err.message + ' in ' + tv4Err.dataPath);
  return errs.join('\n');
}

export function validateCardConfig(data) {
  if (!Array.isArray(data)) {
    return 'Given cardConfig is not an array!';
  }

  if (data.length < 1) {
    return 'Given cardConfig must not be an empty array!';
  }

  const itemsValidationError = data.map(validateSingleCardConfigItem).find((i) => i);
  if (itemsValidationError) {
    return itemsValidationError;
  }

  const valueArray = data.map((i) => i.value);
  if (new Set(valueArray).size !== valueArray.length) {
    return 'CardConfig must not contain two cards with the same value';
  }
}

function validateSingleCardConfigItem(ccItem) {
  const itemProps = Object.keys(ccItem).sort();

  if (
    itemProps.length !== 3 ||
    itemProps[0] !== 'color' ||
    itemProps[1] !== 'label' ||
    itemProps[2] !== 'value'
  ) {
    return 'A card in cardConfig must be an object with these exact 3 properties "color", "label" and "value"';
  }

  if (!Number.isFinite(ccItem.value)) {
    const parsedValue = parseFloat(ccItem.value);
    if (isNaN(parsedValue)) {
      return 'Property "value" on a card in cardConfig must be a number';
    }
  }
  if (typeof ccItem.label !== 'string') {
    return 'Property "label" on a card in cardConfig must be a string';
  }
  if (typeof ccItem.color !== 'string') {
    return 'Property "color" on a card in cardConfig must be a string';
  }
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
