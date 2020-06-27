import parseToStories from './storyImportParser';

/**
 * A user adds wants to import multiple stories
 */
const importStoriesCommandHandler = {
  fn: (room, command) => {
    try {
      const stories = parseToStories(command.payload.data);

      if (stories.length < 1) {
        applyFailed(room, new Error('No Stories in payload'));
        return;
      }

      stories.forEach((story) => {
        room.applyEvent('storyAdded', story);
      });

      if (
        !room.get('stories') ||
        !room
          .get('stories')
          .filter((s) => !s.get('trashed'))
          .first()
      ) {
        // this is the first story that gets added (or all other stories are "trashed")
        room.applyEvent('storySelected', {storyId: stories[0].id});
      }
    } catch (err) {
      applyFailed(room, err);
    }
  }
};

export default importStoriesCommandHandler;

function applyFailed(room, err) {
  room.applyEvent('importFailed', {message: err.message});
}
