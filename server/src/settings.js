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

  // if set to false, in-memory store is used. (currently only option. no working implementation for persistent store...)
  persistentStore: false
};

export default settings;
