/**
 * A user sets a custom card configuration on the room.
 */
import defaultCardConfig from '../defaultCardConfig';

const schema = {
  allOf: [
    {
      $ref: 'command'
    },
    {
      properties: {
        payload: {
          type: 'object',
          properties: {
            cardConfig: {
              type: 'array',
              minItems: 0,
              items: {
                type: 'object',
                properties: {
                  value: {
                    type: ['number', 'string'],
                    format: 'parseableNumber'
                  },
                  label: {
                    type: 'string'
                  },
                  color: {
                    type: 'string'
                  }
                },
                required: ['value', 'label', 'color'],
                additionalProperties: false
              },
              format: 'cardConfig'
            }
          },
          required: ['cardConfig'],
          additionalProperties: false
        }
      }
    }
  ]
};

const setCardConfigCommandHandler = {
  schema,
  fn: (pushEvent, room, command) => {
    const cardConfig = sanitizeCardConfig(command.payload.cardConfig);
    pushEvent('cardConfigSet', {...command.payload, cardConfig});
  }
};

export default setCardConfigCommandHandler;

/**
 * at this point, the command passed validation.
 * cardConfig is an array of objects with "label" "value" and "color" properties. (or an empty array).
 * We allow "value" passed as string. try to parse them to number
 *
 * @param {object[]} cc
 */
function sanitizeCardConfig(cc) {
  if (!cc || cc.length < 1) {
    return defaultCardConfig;
  }
  return cc.map((cardConfigItem) => {
    if (typeof cardConfigItem.value === 'string') {
      cardConfigItem.value = parseFloat(cardConfigItem.value);
    }
    return cardConfigItem;
  });
}
