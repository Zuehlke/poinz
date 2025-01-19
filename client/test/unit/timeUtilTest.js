import {formatTime, getLocalizedFormats} from '../../src/services/timeUtil';

const l10Format = getLocalizedFormats();

test('#secondsToDaysHoursMinutes 1 day 1 hour 1 minute', () => {
  const result = l10Format.secondsToDaysHoursMinutes(60 * 60 * 24 + 60 * 60 + 60);
  expect(result).toEqual('1 day 1 hour 1 minute');
});

test('#secondsToDaysHoursMinutes 2 days 2 hours 2 minutes', () => {
  const result = l10Format.secondsToDaysHoursMinutes(2 * 60 * 60 * 24 + 2 * 60 * 60 + 2 * 60);
  expect(result).toEqual('2 days 2 hours 2 minutes');
});

const DATE_TIME_REGEX = /\w{3} \w{3} \d{2}, \d{2}:\d{2}/; // e.g.  Mon Jan 01, 10:32

test('#formatDateTime ms', () => {
  const result = l10Format.formatDateTime(1234567890 * 1000);
  expect(result).toMatch(DATE_TIME_REGEX);
});

test('#formatDateTime seconds instead of milliseconds', () => {
  const result = l10Format.formatDateTime(1234567890);
  expect(result).toMatch(DATE_TIME_REGEX); // still works, but gives warning
});

test('#formatDateTime date', () => {
  const result = l10Format.formatDateTime(new Date(1234567890 * 1000));
  expect(result).toMatch(DATE_TIME_REGEX);
});

test('#formatDate', () => {
  const result = formatTime(1234567890 * 1000);
  expect(result).toMatch(/\d{2}:\d{2}/);
});
