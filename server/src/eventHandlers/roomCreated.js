import {trackEvent} from '../analytics.js';

/**
 * A room was created. Creates a new default room object
 */
function roomCreatedEventHandler(room, _, userId) {
  // Track room creation event
  trackEvent('room_created', {
    roomId: room.id,
    timestamp: Date.now()
  }, userId);

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
