import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import settings from './settings.js';

export default getLogger;

/**
 * Returns a new Logger for your component
 *
 * @param {string} loggerName
 * @param {string} levelOverride
 * @returns {object} the new Logger
 */
function getLogger(loggerName, levelOverride = undefined) {
  const {format} = winston;

  const formatter = (info) => {
    const splat = info[Symbol.for('splat')] || info.splat || [];

    return `${info.timestamp} ${info.level}: |POINZ| [${loggerName}] ${info.message}  ${
      splat && splat.length
        ? splat.map((s) => JSON.stringify(obfuscatePasswordsInLoggedObjects(s), null, 4))
        : ''
    }  ${info.stack ? ' ' + info.stack : ''}`;
  };

  return winston.loggers.add(loggerName, {
    format: format.combine(format.timestamp(), format.align(), format.printf(formatter)),
    transports: [
      // in prod deployment on heroku, the console gets streamed to Logz.io (ELK stack)
      new winston.transports.Console({
        level: levelOverride ? levelOverride : settings.log.console.level,
        handleExceptions: true
      }),
      new DailyRotateFile({
        filename: settings.log.file.name,
        level: settings.log.file.level,
        timestamp: true,
        handleExceptions: true
      })
    ]
  });
}

/**
 * If an object contains a string property with property name "password", do replace the actual string value with asterisk symbols.
 * This is done recursively through the tree of objects and arrays.
 *
 * @param obj
 * @return {object}
 */
const obfuscatePasswordsInLoggedObjects = (obj) => {
  Object.entries(obj).forEach((entry) => {
    const val = entry[1];
    const key = entry[0];
    if (typeof val === 'object') {
      obj[key] = obfuscatePasswordsInLoggedObjects(val);
    } else if (typeof val === 'string' && key === 'password') {
      obj[key] = '*******';
    }
  });
  return obj;
};
