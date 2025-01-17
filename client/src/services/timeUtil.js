import isDate from 'date-fns/isDate';
import format from 'date-fns/format';
import localeDe from 'date-fns/locale/de';
import localeEn from 'date-fns/locale/en-US';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import formatDuration from 'date-fns/formatDuration';
import log from 'loglevel';

/**
 * some formatting functions (containing months, weekdays, etc.) are dependent on the locale/language
 * @param {string} language Either 'en' or 'de' (at the moment)
 */
export function getLocalizedFormats(language = 'en') {
  const locale = getLocale(language);
  return {
    timeAgo,
    formatDateTime,
    secondsToDaysHoursMinutes
  };

  function timeAgo(dateOrTs) {
    return formatDistanceToNow(normalizeDateOrTs(dateOrTs), {addSuffix: true, locale});
  }

  function formatDateTime(dateOrTs) {
    return format(normalizeDateOrTs(dateOrTs), 'EEE MMM dd, HH:mm', {locale});
  }

  function secondsToDaysHoursMinutes(inSeconds) {
    const inMinutes = Math.floor(inSeconds / 60);
    const minutes = inMinutes % 60;
    const inHours = Math.floor(inMinutes / 60);
    const hours = inHours % 24;
    const days = Math.floor(inHours / 24);

    return formatDuration({days, hours, minutes}, {format: ['days', 'hours', 'minutes'], locale});
  }
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

/**
 * Currently Poinz only supports English and German.
 * We do not want to include all date-fns locales!
 *
 * @param language
 * @return {*}
 */
function getLocale(language) {
  switch (language) {
    case 'de':
      return localeDe;
    case 'en':
      return localeEn;
    default:
      return localeEn;
  }
}
