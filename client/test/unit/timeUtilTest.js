import {formatDateTime, formatTime, secondsToDaysHoursMinutes} from '../../app/services/timeUtil';

test('#secondsToDaysHoursMinutes 1 day 1 hour 1 minute', () => {
  const result = secondsToDaysHoursMinutes(60 * 60 * 24 + 60 * 60 + 60);
  expect(result).toEqual('1 day 1 hour 1 minute');
});

test('#secondsToDaysHoursMinutes 2 days 2 hours 2 minutes', () => {
  const result = secondsToDaysHoursMinutes(2 * 60 * 60 * 24 + 2 * 60 * 60 + 2 * 60);
  expect(result).toEqual('2 days 2 hours 2 minutes');
});

test('#formatDateTime ms', () => {
  const result = formatDateTime(1234567890 * 1000);
  expect(result).toEqual('14.02.2009 00:31');
});

test('#formatDateTime seconds instead of milliseconds', () => {
  const result = formatDateTime(1234567890);
  expect(result).toEqual('15.01.1970 07:56'); // still works, but gives warning
});

test('#formatDateTime date', () => {
  const result = formatDateTime(new Date(1234567890 * 1000));
  expect(result).toEqual('14.02.2009 00:31');
});

test('#formatDate', () => {
  const result = formatTime(1234567890 * 1000);
  expect(result).toEqual('00:31');
});
