// properties / settings for PoinZ backend

if (!process.env.NODE_ENV) {
  throw new Error(
    'Specify NODE_ENV environment variable. Either set to "development" or "production"'
  );
}

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

  // if environment variable "ATLAS_DB_URI" is set (in heroku deployment), persistent store is used.
  // if env variable is not set, "persistentStore" is false and in-memory store is used.

  // as of august 2020, switched from mLab to mongoDB Atlas
  persistentStore: process.env.ATLAS_DB_URI
    ? {
        connectionURI: process.env.ATLAS_DB_URI
      }
    : false
};

export default settings;
