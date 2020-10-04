const hasActiveStories = (room) => {
  if (!room.stories) {
    return false;
  }

  const activeStories = Object.values(room.stories).filter((s) => !s.trashed);
  return activeStories.length > 0;
};

export default hasActiveStories;
