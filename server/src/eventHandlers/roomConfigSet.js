/**
 *
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
