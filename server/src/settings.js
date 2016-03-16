// properties / settings for PoinZ backend

module.exports = {

  // host + port for webserver + socketserver
  serverHost: '0.0.0.0',
  serverPort: 3000,

  // configuration for winston logging
  log: {
    file: {
      level: 'warn',
      name: 'poinz.log'
    },
    console: {
      level: 'warn'
    }
  },

  // configuration for redis connection (roomsStore)
  redis: {
    host: '127.0.0.1',
    port: 6379
  }
};
