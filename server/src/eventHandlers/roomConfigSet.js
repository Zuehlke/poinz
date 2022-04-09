/**
 * sets autoReveal, withConfidence flags on room.
 * sets issueTrackingUrl on room
 */
const roomConfigSetEventHandler = (room, eventPayload) => {
  return {
    ...room,
    autoReveal: !!eventPayload.autoReveal,
    withConfidence: !!eventPayload.withConfidence,
    issueTrackingUrl: eventPayload.issueTrackingUrl ? eventPayload.issueTrackingUrl : undefined
  };
};

export default roomConfigSetEventHandler;
