/**
 * A user manually reveals estimates for a certain story
 * Users may only reveal the currently selected story
 */
const revealCommandHandler = {
  preCondition: (room, command) => {
    if (room.get('selectedStory') !== command.payload.storyId) {
      throw new Error('Can only reveal currently selected story!');
    }
  },
  fn: (room, command) => {
    if (room.getIn(['stories', command.payload.storyId, 'revealed'])) {
      return;
    }

    room.applyEvent('revealed', {
      storyId: command.payload.storyId,
      manually: true
    });
  }
};

export default revealCommandHandler;
