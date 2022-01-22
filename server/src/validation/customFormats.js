const EMAIL_REGEX =
  /^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
const EMAIL_MAX_LENGTH = 254;
const ROOMID_REGEX = /^[-a-z0-9_]+$/; // roomId must not contain uppercase values
const UUIDv4_OR_NANOID_REGEX =
  /^([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|[-a-z0-9_]{21})$/; // either an old uuidv4 (lowercase) or a nanoid (limited alphabet, no uppercase letters)
const CsvDATAURL_REGEX =
  /^data:(text\/csv|application\/vnd.ms-excel|application\/csv|text\/x-csv|application\/x-csv|text\/comma-separated-values|text\/x-comma-separated-values);base64,/;
const USERNAME_REGEX = /^.{3,80}$/;

/**
 * registers our custom formats like "username" "email" "roomId" "uuid"  with the given tv4 instance
 * @param tvi
 */
export function registerCustomFormats(tvi) {
  tvi.addFormat('email', (data) => {
    if (!data) {
      return; // allow empty string, undefined, null
    }

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

  /**
   *  format "uid"  will match either the previously used UUIDv4 (https://www.npmjs.com/package/uuid) or the newly used nanoid (https://www.npmjs.com/package/nanoid)
   *  we still need to accept old uuidv4, there are still such ids present in our persistent store in production.
   *  **/

  tvi.addFormat(
    'uuid',
    validateStringFormat.bind(
      undefined,
      UUIDv4_OR_NANOID_REGEX,
      'must be a valid nanoid or uuid v4'
    )
  );
  tvi.addFormat(
    'csvDataUrl',
    validateStringFormat.bind(undefined, CsvDATAURL_REGEX, 'must be a valid text/csv data url')
  );
  tvi.addFormat(
    'username',
    validateStringFormat.bind(undefined, USERNAME_REGEX, 'must be a valid username')
  );
  tvi.addFormat('parseableNumber', parseableNumber);
  tvi.addFormat('cardConfig', cardConfigUniqueValue);
}

function validateStringFormat(formatRegex, errorMsg, data) {
  if (!data) {
    return; // allow empty string, undefined, null
  }

  if (typeof data === 'string' && formatRegex.test(data)) {
    return;
  }

  return errorMsg;
}

/**
 * The whole cardConfig is validated through default tv4 mechanisms (see commandHandlers/setCardConfig.js  cardConfigSchema)
 * Here we check uniqueness of items in the array.
 *
 * @param {object[]} data
 */
function cardConfigUniqueValue(data) {
  if (!data) {
    return;
  }
  const valueArray = data.map((i) => i.value);
  if (new Set(valueArray).size !== valueArray.length) {
    return 'CardConfig must not contain two cards with the same value';
  }
}

export function parseableNumber(data) {
  if (!Number.isFinite(data)) {
    const parsedValue = parseFloat(data);
    if (isNaN(parsedValue)) {
      return 'Given value is not parseable to a number';
    }
  }
}
