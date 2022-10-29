import ejs from 'ejs';

import settings from '../docuSettings.mjs';

const renderDocu = ({commandHandlerFileData, eventList}, poinzVersion) => {
  return new Promise((resolve, reject) => {
    ejs.renderFile(
      settings.commandAndEventDocuTemplate,
      {commandHandlerFileData, eventList, now: new Date().toLocaleString(), version: poinzVersion},
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
