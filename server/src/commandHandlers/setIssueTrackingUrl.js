/**
 * A user sets a issue tracking URL on the room.
 * If such a URL is set, imported stories will have a link to the issue e.g. on jira.
 * The placeholder {ISSUE} in the url will be replaced with the respective issue key.
 *
 * Example for such a issue tracking URL:  https://jira.mycompany.com/browse/{ISSUE}
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
            url: 'string' // don't make "url" a required property. can be empty / undefined / null to remove the issue tracking url
          },
          required: [],
          additionalProperties: false
        }
      }
    }
  ]
};

const setIssueTrackingUrlCommandHandler = {
  schema,
  fn: (pushEvent, room, command) => {
    pushEvent('issueTrackingUrlSet', command.payload);
  }
};

export default setIssueTrackingUrlCommandHandler;
