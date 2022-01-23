const storySchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid'
    },
    title: {
      type: 'string',
      minLength: 1,
      maxLength: 100
    },
    description: {
      type: ['string', 'undefined', 'null'],
      minLength: 0,
      maxLength: 2000
    },
    estimations: {
      type: 'object'
    },
    estimationsConfidence: {
      type: 'object'
    },
    createdAt: {
      type: 'number'
    },
    consensus: {
      type: ['number', 'undefined', 'null']
    },
    trashed: {
      type: 'boolean'
    },
    revealed: {
      type: 'boolean'
    }
  },
  required: ['id', 'title', 'createdAt'],
  additionalProperties: false
};

const userSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid'
    },
    username: {
      type: ['string', 'undefined', 'null'],
      format: 'username'
    },
    email: {
      type: ['string', 'undefined', 'null'],
      format: 'email'
    },
    emailHash: {
      type: ['string', 'undefined', 'null']
    },
    avatar: {
      type: 'number'
    },
    disconnected: {
      type: 'boolean'
    },
    excluded: {
      type: 'boolean'
    }
  },
  required: ['id', 'avatar'],
  additionalProperties: false
};

const roomSchema = {
  properties: {
    id: {
      type: 'string',
      format: 'roomId'
    },
    selectedStory: {
      type: ['string', 'undefined', 'null'],
      format: 'uuid'
    },
    cardConfig: {
      type: ['array', 'undefined', 'null'],
      format: 'cardConfig'
    },
    stories: {
      type: 'array',
      items: storySchema
    },
    users: {
      type: 'array',
      items: userSchema
    },
    created: {
      type: 'number'
    },
    lastActivity: {
      type: 'number'
    },
    autoReveal: {
      type: 'boolean'
    },
    withConfidence: {
      type: 'boolean'
    },
    issueTrackingUrl: {
      type: ['string', 'undefined', 'null']
    },
    markedForDeletion: {
      type: 'boolean'
    },
    password: {
      type: 'object',
      properties: {
        hash: {
          type: 'string'
        },
        salt: {
          type: 'string'
        }
      }
    }
  },
  required: ['id', 'stories', 'users', 'created', 'lastActivity', 'markedForDeletion'],
  additionalProperties: false
};

export default roomSchema;
