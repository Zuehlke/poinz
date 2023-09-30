import defaultCardConfig from '../defaultCardConfig.js';

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
    stories: room.stories.map((story) => mapStoryExportDto(story, room.users))
  };
}

function mapStoryExportDto(story, users) {
  const usernamesMap = users.reduce((total, currentUser) => {
    total[currentUser.id] = currentUser.username || currentUser.id;
    return total;
  }, {});

  const mappedStory = {
    title: story.title,
    description: story.description,
    estimations: Object.entries(story.estimations).map((entry) => {
      const matchingUser = usernamesMap[entry[0]];
      const mappedEstm = {
        username: matchingUser ? matchingUser : entry[0],
        value: entry[1]
      };

      if (matchingUser) {
        mappedEstm.userId = entry[0];
      }

      if (story.estimationsConfidence && story.estimationsConfidence[entry[0]]) {
        mappedEstm.confidence = story.estimationsConfidence[entry[0]];
      }
      return mappedEstm;
    })
  };

  // set these optional properties only if they are set/true in the story
  if (story.trashed) {
    mappedStory.trashed = true;
  }

  if (story.consensus) {
    mappedStory.consensus = story.consensus;
  }

  if (story.key) {
    mappedStory.key = story.key;
  }

  return mappedStory;
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
  const {
    id,
    autoReveal,
    withConfidence,
    issueTrackingUrl,
    selectedStory,
    stories,
    users,
    cardConfig
  } = room;

  return {
    id,
    autoReveal,
    withConfidence,
    issueTrackingUrl,
    selectedStory,
    stories,
    users,
    passwordProtected: !!room.password,
    cardConfig: cardConfig ? cardConfig : defaultCardConfig
  };
}

/**
 *
 * @param {object[]} rooms List rooms from the store
 * @param {number} totalRoomCount
 * @param {string} storeType
 * @return {{roomCount: number, totalRoomCount: number, storeInfo: string, mappedRooms: {userCount: *, created: *, userCountDisconnected: *, lastActivity: *, markedForDeletion: *, storyCount: *}[], uptime: number}}
 */
export function mapAppStatusDto(rooms, totalRoomCount, storeType) {
  const mappedRooms = Object.values(rooms).map((room) => ({
    storyCount: room.stories.length,
    userCount: room.users.length,
    userCountDisconnected: room.users.filter((user) => user.disconnected).length,
    lastActivity: room.lastActivity,
    markedForDeletion: room.markedForDeletion,
    created: room.created
  }));

  return {
    rooms: mappedRooms,
    roomCount: mappedRooms.length,
    storeInfo: storeType,
    totalRoomCount,
    uptime: Math.floor(process.uptime())
  };
}
