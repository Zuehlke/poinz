import ejs from 'ejs';

import settings from '../docuSettings.mjs';

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

export default renderDocu;
