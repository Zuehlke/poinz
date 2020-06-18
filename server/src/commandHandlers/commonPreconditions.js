export function throwIfUserIdNotFoundInRoom(room, userId) {
  if (!room.getIn(['users', userId])) {
    throw new Error(`Given user ${userId} does not belong to room ${room.get('id')}`);
  }
}

export function throwIfStoryIdNotFoundInRoom(room, storyId) {
  if (!room.getIn(['stories', storyId])) {
    throw new Error(`Given story ${storyId} does not belong to room ${room.get('id')}`);
  }
}
