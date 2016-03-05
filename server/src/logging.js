const
  winston = require('winston'),
  dailyRotateFileTransport = require('winston-daily-rotate-file');

winston.loggers.options.transports = [
  new winston.transports.Console({
    level: 'info',
    showLevel: false,
    timestamp: true
  }),
  new dailyRotateFileTransport({
    filename: 'poinz.log',
    level: 'info',
    json: false,
    timestamp: true
  })
];

/**
 * returns a new Logger for your component
 * @param {string} loggerName
 * @returns {object} the new Logger
 */
function getLogger(loggerName) {
  var newLogger = winston.loggers.add(loggerName);
  newLogger.filters.push((level, msg, meta) => {
    return {
      msg: `[${level}] ${loggerName}: ${msg}`,
      meta: meta
    };
  });

  return newLogger;
}

module.exports = {getLogger};
