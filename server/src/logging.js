import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import settings from './settings';

module.exports = {
  getLogger
};

/**
 * Returns a new Logger for your component
 *
 * @param {string} loggerName
 * @returns {object} the new Logger
 */
function getLogger(loggerName) {
  const {format} = winston;

  return winston.loggers.add(loggerName, {
    transports: [
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        format: format.combine(
          format.colorize(),
          format.timestamp(),
          format.align(),
          format.printf(
            (info) =>
              `${info.timestamp} ${info.level}: [${loggerName}] ${info.message}${
                info.stack ? ' ' + info.stack : ''
                }`
          )
        )
      }),
      new DailyRotateFile({
        filename: settings.log.file.name,
        level: settings.log.file.level,
        timestamp: true,
        handleExceptions: true,
        format: format.combine(
          format.timestamp(),
          format.align(),
          format.printf(
            (info) =>
              `${info.timestamp} ${info.level}: [${loggerName}] ${info.message}${
                info.stack ? ' ' + info.stack : ''
                }`
          )
        )
      })
    ]
  });
}
