/**
 *
 * @param room
 * @param {string} storyId
 * @param {function} modifier
 * @return {object} The modified room
 */
export function modifyStory(room, storyId, modifier) {
  const modifiedStories = room.stories.map((story) => {
    if (story.id !== storyId) {
      return story;
    }
    return modifier(story);
  });
  return {
    ...room,
    stories: modifiedStories
  };
}

/**
 *
 * @param room
 * @param {string} userId
 * @param {function} modifier
 * @return {object} The modified room
 */
export function modifyUser(room, userId, modifier) {
  const modifiedUsers = room.users.map((user) => {
    if (user.id !== userId) {
      return user;
    }
    return modifier(user);
  });
  return {
    ...room,
    users: modifiedUsers
  };
}

export function removeById(arr, id) {
  const matchindIndex = arr.findIndex((item) => item.id === id);
  if (matchindIndex < 0) {
    throw new Error('no match with given id in array!');
  }

  return [...arr.slice(0, matchindIndex), ...arr.slice(matchindIndex + 1)];
}
