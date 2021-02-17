const path = require('path');

module.exports = {
  commandAndEventDocuTemplate: path.resolve(__dirname, './templates/commandAndEventDocu.ejs'),
  cmdHandlersDirPath: path.resolve(__dirname, '../server/src/commandHandlers'),
  evtHandlersDirPath: path.resolve(__dirname, '../server/src/eventHandlers'),
  diagramsDirPath: path.resolve(__dirname, './diagrams'),
  docuOutputDirPath: path.resolve(__dirname, './')
};
