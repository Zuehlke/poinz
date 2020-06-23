// properties / settings for PoinZ backend

const settings = {
  // port for webserver & socketserver
  serverPort: process.env.PORT || 3000,

  // configuration for winston logging
  log: {
    file: {
      level: 'info',
      name: 'poinz.log'
    },
    console: {
      level: 'info'
    }
  },

  // if environment variable "MONGODB_URI" is set (like in heroku prod deployment), persistent store is used.
  // if env variable is not set, "persistentStore" is false and in-memory store is used.
  persistentStore: process.env.MONGODB_URI
    ? {
        connectionURI: process.env.MONGODB_URI
      }
    : false
};

export default settings;
