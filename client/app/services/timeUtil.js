import isDate from 'date-fns/isDate';
import format from 'date-fns/format';
import formatDistance from 'date-fns/formatDistance';
import log from 'loglevel';

/**
 *
 * @param inSeconds
 */
export function secondsToDaysHoursMinutes(inSeconds) {
  const inMinutes = Math.floor(inSeconds / 60);
  const minutes = inMinutes % 60;
  const inHours = Math.floor(inMinutes / 60);
  const hours = inHours % 24;
  const days = Math.floor(inHours / 24);

  return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${
    minutes > 1 ? 's' : ''
  }`;
}

export function timeAgo(dateOrTs) {
  return formatDistance(normalizeDateOrTs(dateOrTs), new Date(), {addSuffix: true});
}

export function formatDateTime(dateOrTs) {
  return format(normalizeDateOrTs(dateOrTs), 'dd.MM.yyyy HH:mm');
}

export function formatTime(dateOrTs) {
  return format(normalizeDateOrTs(dateOrTs), 'HH:mm');
}

function normalizeDateOrTs(dateOrTs) {
  if (isDate(dateOrTs)) {
    return dateOrTs;
  }

  const dateObject = new Date(dateOrTs);
  if (log.getLevel() <= log.levels.DEBUG && dateObject.getFullYear() < 2000) {
    log.warn('DateObject is far in the past. Check Seconds versus Milliseconds!', dateObject);
  }
  return dateObject;
}
