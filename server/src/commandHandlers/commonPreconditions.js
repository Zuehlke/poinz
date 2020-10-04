export function throwIfUserIdNotFoundInRoom(room, userId) {
  if (!room.users || !room.users[userId]) {
    throw new Error(`Given user ${userId} does not belong to room ${room.id}`);
  }
}

export function throwIfStoryIdNotFoundInRoom(room, storyId) {
  if (!room.stories || !room.stories[storyId]) {
    throw new Error(`Given story ${storyId} does not belong to room ${room.id}`);
  }
}

export function throwIfStoryTrashed(room, storyId) {
  throwIfStoryIdNotFoundInRoom(room, storyId);

  if (room.stories[storyId].trashed) {
    throw new Error(
      `Given story .${storyId} is marked as "trashed" and cannot be selected or manipulated`
    );
  }
}
