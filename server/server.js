var
  express = require('express');

var socketServer = require('./socketServer');

var app = express();

// routes setup
app.get('/', function (req, res) {
  res.send('Hello World')
});
// TODO: add static serve of built client (for production)

var server = socketServer.init(app);
server.listen(3000);

