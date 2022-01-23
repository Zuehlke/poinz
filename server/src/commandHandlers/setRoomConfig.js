/**
 *
 * This command allows to set multiple config properties on the room:
 *
 * # Issue Tracking URL
 * If such a URL is set, imported stories will have a link to the issue e.g. on jira.
 * The placeholder {ISSUE} in the url will be replaced with the respective issue key.
 * Example for such a issue tracking URL:  https://jira.mycompany.com/browse/{ISSUE}
 *
 *
 * # AutoReveal
 * This is by default "on". Room wil automatically reveal current story if all users estimated.
 *
 * # WithConfidence
 * This is by default "off". If enabled, users can specify their estimation "confidence"
 *
 */
const schema = {
  allOf: [
    {
      $ref: 'command'
    },
    {
      properties: {
        payload: {
          type: 'object',
          properties: {
            autoReveal: ['boolean', 'undefined', 'null'],
            withConfidence: ['boolean', 'undefined', 'null'],
            issueTrackingUrl: ['string', 'undefined', 'null']
          },
          required: [],
          additionalProperties: false
        }
      }
    }
  ]
};

const setRoomConfigCommandHandler = {
  schema,
  fn: (pushEvent, room, command) => {
    pushEvent('roomConfigSet', command.payload);
  }
};

export default setRoomConfigCommandHandler;
