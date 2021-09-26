import util from 'util';
import tv4 from 'tv4';

import getLogger from '../getLogger';
import {registerCustomFormats} from './customFormats';
import roomSchema from '../roomSchema';

const LOGGER = getLogger('commandSchemaValidator');

/**
 * Creates a new instance of the validator-function
 *
 * Every command that is received by the server is checked for structural integrity (i.e. adheres to its defined schema).
 * The schema is defined as v4 json schema on the respective commandHandler.
 * Every command is checked against its schema via "tv4" (See https://github.com/geraintluff/tv4)
 *
 * (see also http://json-schema.org/, https://www.npmjs.com/package/tv4)
 *
 * @param {object} commandSchemas An object containing all schemas for all commands
 * @return {function} A new validate function
 */
export function commandSchemaValidatorFactory(commandSchemas) {
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

    const valid = tvInstance.validate(cmd, schema); // we no longer use validateMultiple. quite a big impact on performance
    if (!valid) {
      throw new CommandValidationError(
        new Error(formatValidationErrorMessage(tvInstance.error)),
        cmd
      );
    }
  }
}

/**
 *
 */
export function roomSchemaValidatorFactory() {
  const tvInstance = tv4.freshApi();

  registerCustomFormats(tvInstance);

  return validate;

  /**
   * Validates the given room against its schema.
   **/
  function validate(room) {
    const valid = tvInstance.validate(room, roomSchema); // we no longer use validateMultiple. quite a big impact on performance
    if (!valid) {
      throw new Error(
        `Invalid room object: ${formatValidationErrorMessage(
          tvInstance.error
        )}    See /server/src/roomSchema.js if you want to modify the room schema...`
      );
    }
  }
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

function formatValidationErrorMessage(tv4Err) {
  return `${tv4Err.message} in ${tv4Err.dataPath || '-'}`;
}

function CommandValidationError(err, cmd) {
  this.stack = err.stack;
  this.name = this.constructor.name;
  this.message = `Command validation Error during "${cmd.name}": ${err.message}`;
}

util.inherits(CommandValidationError, Error);
