/**
 * A user sets a custom card configuration on the room.
 */

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
  fn: (room, command) => {
    const cardConfig = sanitizeCardConfig(command.payload.cardConfig);
    room.applyEvent('cardConfigSet', {...command.payload, cardConfig});
  }
};

export default setCardConfigCommandHandler;

/**
 * at this point, the command passed validation.
 * cardConfig is an array of objects with "label" "value" and "color" properties.
 * We allow "value" passed as string. try to parse them to number
 *
 * @param {object[]} cc
 */
function sanitizeCardConfig(cc) {
  return cc.map((cardConfigItem) => {
    if (typeof cardConfigItem.value === 'string') {
      cardConfigItem.value = parseFloat(cardConfigItem.value);
    }
    return cardConfigItem;
  });
}
