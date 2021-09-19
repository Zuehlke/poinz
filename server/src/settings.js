// properties / settings for PoinZ backend

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const settings = {
  // port for webserver & socketserver
  serverPort: process.env.PORT || 3000,

  // configuration for winston logging
  log: {
    file: {
      level: process.env.NODE_ENV === 'test' ? 'warn' : 'info',
      name: 'poinz.log'
    },
    console: {
      level: process.env.NODE_ENV === 'test' ? 'warn' : 'info'
    }
  },

  // if environment variable "ATLAS_DB_URI" is set (in heroku deployment), persistent store is used.
  // the db uri already contains username and password
  // if env variable is not set, "persistentStore" is false and in-memory store is used.
  // as of august 2020, switched from mLab to mongoDB Atlas
  persistentStore: process.env.ATLAS_DB_URI ? process.env.ATLAS_DB_URI : false
};

export default settings;
