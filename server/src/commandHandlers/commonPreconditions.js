export function throwIfUserIdNotFoundInRoom(room, userId) {
  const match = (room.users || []).find((usr) => usr.id === userId);
  if (!match) {
    throw new Error(`Given user ${userId} does not belong to room ${room.id}`);
  }
}

/**
 *
 * @param {object} room
 * @param {string} userId
 * @return {object} The matching user
 */
export function getMatchingUserOrThrow(room, userId) {
  const match = (room.users || []).find((usr) => usr.id === userId);
  if (!match) {
    throw new Error(`Given user ${userId} does not belong to room ${room.id}`);
  }
  return match;
}

/**
 *
 * @param {object} room
 * @param {string} storyId
 * @return {object} The matching story
 */
export function getMatchingStoryOrThrow(room, storyId) {
  const match = (room.stories || []).find((story) => story.id === storyId);
  if (!match) {
    throw new Error(`Given story ${storyId} does not belong to room ${room.id}`);
  }
  return match;
}

export function throwIfStoryTrashed(room, storyId) {
  const matchingStory = getMatchingStoryOrThrow(room, storyId);

  if (matchingStory.trashed) {
    throw new Error(
      `Given story .${storyId} is marked as "trashed" and cannot be selected or manipulated`
    );
  }
}
