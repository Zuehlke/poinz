const EMAIL_REGEX = /^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
const EMAIL_MAX_LENGTH = 254;
const ROOMID_REGEX = /^[-a-z0-9_]+$/;
const UUIDv4_REGEX = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
const CsvDATAURL_REGEX = /^data:(text\/csv|application\/vnd.ms-excel|application\/csv|text\/x-csv|application\/x-csv|text\/comma-separated-values|text\/x-comma-separated-values);base64,/;
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

function validateStringFormat(formatRegex, errorMsg, data) {
  if (!data) {
    return; // allow empty string, undefined, null
  }

  if (typeof data === 'string' && formatRegex.test(data)) {
    return;
  }

  return errorMsg;
}

export function validateCardConfig(data) {
  if (!data) {
    return; // allow undefined, null
  }

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
