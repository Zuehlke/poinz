/**
 * user did set new password for room
 */
const issueTrackingUrlSetEventHandler = (room, eventPayload) => {
  return {
    ...room,
    issueTrackingUrl: eventPayload.url ? eventPayload.url : undefined
  };
};

export default issueTrackingUrlSetEventHandler;
