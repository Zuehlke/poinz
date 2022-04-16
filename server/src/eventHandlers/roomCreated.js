/**
 * A room was created. Creates a new default room object
 */
function roomCreatedEventHandler(room) {
  return {
    id: room.id,
    users: [],
    stories: [],
    created: Date.now(),
    autoReveal: true,
    withConfidence: false,
    issueTrackingUrl: undefined
  };
}

export default roomCreatedEventHandler;
