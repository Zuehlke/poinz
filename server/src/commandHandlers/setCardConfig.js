/**
 * A user sets a custom card configuration on the room.
 */
const setCardConfigCommandHandler = {
  fn: (room, command) => {
    const cardConfig = sanitizeCardConfig(command.payload.cardConfig);
    room.applyEvent('cardConfigSet', {...command.payload, cardConfig});
  }
};

export default setCardConfigCommandHandler;

/**
 * at this point, the command passed validation.
 * cardConfig is an array of objects with "label" "value" and "color" properties
 *
 * @param cc
 */
function sanitizeCardConfig(cc) {
  return cc.map((cardConfigItem) => {
    if (typeof cardConfigItem.value === 'string') {
      cardConfigItem.value = parseFloat(cardConfigItem.value);
    }
    return cardConfigItem;
  });
}
