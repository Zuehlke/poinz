const hasActiveStories = (room) => {
  const activeStories = (room.stories || []).filter((s) => !s.trashed);
  return activeStories.length > 0;
};

export default hasActiveStories;
