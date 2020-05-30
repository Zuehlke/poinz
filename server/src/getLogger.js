import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import settings from './settings';

export default getLogger;

/**
 * Returns a new Logger for your component
 *
 * @param {string} loggerName
 * @returns {object} the new Logger
 */
function getLogger(loggerName) {
  const {format} = winston;

  const formatter = (info) => {
    const splat = info[Symbol.for('splat')] || info.splat || [];

    return `${info.timestamp} ${info.level}: [${loggerName}] ${info.message}  ${
      splat && splat.length ? splat.map((s) => JSON.stringify(s, null, 4)) : ''
    }  ${info.stack ? ' ' + info.stack : ''}`;
  };

  return winston.loggers.add(loggerName, {
    transports: [
      new winston.transports.Console({
        level: settings.log.console.level,
        handleExceptions: true,
        format: format.combine(
          format.colorize(),
          format.timestamp(),
          format.align(),
          format.printf(formatter)
        )
      }),
      new DailyRotateFile({
        filename: settings.log.file.name,
        level: settings.log.file.level,
        timestamp: true,
        handleExceptions: true,
        format: format.combine(format.timestamp(), format.align(), format.printf(formatter))
      })
    ]
  });
}
