/**
 * A user manually reveals estimates for a certain story
 * Users may only reveal the currently selected story
 * If story is already revealed, reject command.
 *
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
            storyId: {
              type: 'string',
              minLength: 1
            }
          },
          required: ['storyId'],
          additionalProperties: false
        }
      }
    }
  ]
};

const revealCommandHandler = {
  schema,
  preCondition: (room, command) => {
    if (room.get('selectedStory') !== command.payload.storyId) {
      throw new Error('Can only reveal currently selected story!');
    }

    if (room.getIn(['stories', command.payload.storyId, 'revealed'])) {
      throw new Error('Story is already revealed');
    }
  },
  fn: (room, command) => {
    room.applyEvent('revealed', {
      storyId: command.payload.storyId,
      manually: true
    });
  }
};

export default revealCommandHandler;
