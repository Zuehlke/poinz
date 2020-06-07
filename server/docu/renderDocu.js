const path = require('path');
const ejs = require('ejs');

const renderDocu = ({commandHandlerFileData, eventList}) => {
  return new Promise((resolve, reject) => {
    ejs.renderFile(
      path.join(__dirname, './templates/main.ejs'),
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
