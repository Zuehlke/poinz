// properties / settings for PoinZ backend

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const settings = {
  // port for webserver & socketserver
  // From heroku documentation: "The web process must listen for HTTP traffic on $PORT [...], EXPOSE in Dockerfile is not respected (but can be used for local testing)
  // https://devcenter.heroku.com/articles/container-registry-and-runtime#building-and-pushing-image-s
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
  // value will be something like mongodb+srv://heroku_h9027nkx:PASSWORD@heroku-h9027nkx.dv5oi.mongodb.net/heroku_h9027nkx?retryWrites=true&w=majority
  persistentStore: process.env.ATLAS_DB_URI
    ? {
        connectionURI: process.env.ATLAS_DB_URI
      }
    : false
};

export default settings;
