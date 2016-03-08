// properties / settings for PoinZ backend

module.exports = {
  serverHost: '0.0.0.0',
  serverPort: 3000,

  // if set, the backend will delay sending produced events to clients (can be useful to simulate latency)
  // set to 0 to disable
  eventDelay: 0
};
