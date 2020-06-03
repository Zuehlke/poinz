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

  // if set to false, in-memory store is used.
  persistentStore: false
  /*
  persistentStore: {
    connectionURI: process.env.MONGODB_URI, // this is set by heroku mLab MonogDb add-on
    dbName: 'poinz'
  }
  */
};

export default settings;
