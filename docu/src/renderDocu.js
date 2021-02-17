const ejs = require('ejs');

const settings = require('../docuSettings');

const renderDocu = ({commandHandlerFileData, eventList}) => {
  return new Promise((resolve, reject) => {
    ejs.renderFile(
      settings.commandAndEventDocuTemplate,
      {commandHandlerFileData, eventList, now: new Date().toLocaleString()},
      {
        /* options */
      },
      (err, str) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(str);
      }
    );
  });
};

module.exports = renderDocu;
