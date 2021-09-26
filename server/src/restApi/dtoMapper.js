import defaultCardConfig from '../defaultCardConfig';

/**
 * Maps room to limited set of properties for export (room as file download).
 *
 * @param room
 * @return {undefined|{stories: *, exportedAt: number, roomId}}
 */
export function mapRoomExportDto(room) {
  if (!room) {
    return undefined;
  }

  return {
    roomId: room.id,
    exportedAt: Date.now(),
    stories: room.stories
      .filter((story) => !story.trashed)
      .map((story) => mapStoryExportDto(story, room.users))
  };
}

function mapStoryExportDto(story, users) {
  const usernamesMap = users.reduce((total, currentUser) => {
    total[currentUser.id] = currentUser.username || currentUser.id;
    return total;
  }, {});

  return {
    title: story.title,
    description: story.description,
    consensus: story.consensus,
    estimations: Object.entries(story.estimations).map((entry) => {
      const matchingUser = usernamesMap[entry[0]];
      return {username: matchingUser ? matchingUser : entry[0], value: entry[1]};
    })
  };
}

/**
 * Maps to extensive set of properties. This is used to re-sync client state with backend state and should return the same information as contained in the "joinedRoom" event.
 *
 * @param room
 * @return {undefined|{selectedStory, stories, autoReveal, id, cardConfig: *, users}}
 */
export function mapRoomStateDto(room) {
  if (!room) {
    return undefined;
  }
  const {id, autoReveal, withConfidence, selectedStory, stories, users, cardConfig} = room;

  return {
    id,
    autoReveal,
    withConfidence,
    selectedStory,
    stories,
    users,
    passwordProtected: !!room.password,
    cardConfig: cardConfig ? cardConfig : defaultCardConfig
  };
}

/**
 *
 * @param {object[]} allRooms List of all rooms from the store
 * @param {string} storeType
 * @return {{roomCount: number, rooms: {userCount: *, created: number|*, userCountDisconnected: *, lastActivity: number|*, markedForDeletion: boolean|[]|*, storyCount: *}[], storeInfo: (string|*), uptime: number}}
 */
export function mapAppStatusDto(allRooms, storeType) {
  const rooms = Object.values(allRooms).map((room) => ({
    storyCount: room.stories.length,
    userCount: room.users.length,
    userCountDisconnected: room.users.filter((user) => user.disconnected).length,
    lastActivity: room.lastActivity,
    markedForDeletion: room.markedForDeletion,
    created: room.created
  }));

  return {
    rooms,
    roomCount: rooms.length,
    uptime: Math.floor(process.uptime()),
    storeInfo: storeType
  };
}
